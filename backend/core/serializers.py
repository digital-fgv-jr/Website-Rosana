# Serializers 17.7.32
from rest_framework import serializers
from django.conf import settings
from django.db import transaction
from django.db.models import F # Importante para a dedução segura de estoque
import requests
import json
from datetime import date, timedelta
import mercadopago # Importa a SDK do Mercado Pago

from .models import (
    Loja, Endereco, Contato, ContatoLoja, Categoria, Produto, 
    DetalheProduto, Tamanho, TamanhoProduto, Pedido, ItemPedido, 
    InformacoesEntrega, ImagemProduto, ImagemCategoria
)

#======================================================================
# 1. SERIALIZERS BASE E REUTILIZÁVEIS
#======================================================================

class ImagemProdutoSerializer(serializers.ModelSerializer):
    """ Serializer simples para retornar a URL da imagem de um produto. """
    class Meta:
        model = ImagemProduto
        fields = ['imagem']

class ImagemCategoriaSerializer(serializers.ModelSerializer):
    """ Serializer simples para retornar a URL da imagem de uma categoria. """
    class Meta:
        model = ImagemCategoria
        fields = ['imagem']

class LojaNestedSerializer(serializers.ModelSerializer):
    """ Representação aninhada e simples de uma Loja. """
    class Meta:
        model = Loja
        fields = ['id', 'apelido']

class CategoriaNestedSerializer(serializers.ModelSerializer):
    """ Representação aninhada e simples de uma Categoria. """
    class Meta:
        model = Categoria
        fields = ['id', 'nome_categoria']

class DetalheProdutoSerializer(serializers.ModelSerializer):
    """ Serializer para os detalhes (propriedade/descrição) do produto. """
    class Meta:
        model = DetalheProduto
        fields = ['propriedade', 'descricao']

class TamanhoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tamanho
        fields = ['nome', 'valor']

class TamanhoProdutoSerializer(serializers.ModelSerializer):
    """ Mostra o tamanho (nome e valor) associado a um produto. """
    tamanho = TamanhoSerializer(read_only=True)
    class Meta:
        model = TamanhoProduto
        fields = ['id', 'tamanho']

#======================================================================
# 2. SERIALIZERS PARA ENDPOINTS ESPECÍFICOS
#======================================================================

#== Endpoint: /lojas ==#
class EnderecoLojaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Endereco
        exclude = ['id', 'loja']

class ContatoParaLojaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contato
        fields = ['nome', 'sobrenome', 'cpf', 'email', 'whatsapp']

class ContatoLojaSerializer(serializers.ModelSerializer):
    contato = ContatoParaLojaSerializer()
    class Meta:
        model = ContatoLoja
        fields = ['contato', 'instagram', 'cnpj']

class LojaPublicSerializer(serializers.ModelSerializer):
    """ Serializer completo para a lista de lojas. """
    contato_loja = ContatoLojaSerializer(source='contatoloja', read_only=True)
    enderecos = EnderecoLojaSerializer(many=True, source='endereco_set', read_only=True)
    class Meta:
        model = Loja
        fields = ['id', 'apelido', 'contato_loja', 'enderecos']

#== Endpoint: /categorias ==#
class CategoriaListSerializer(serializers.ModelSerializer):
    """ Serializer para a lista de categorias, com dados da loja aninhados e a primeira imagem. """
    loja = LojaNestedSerializer(read_only=True)
    primeira_imagem = serializers.SerializerMethodField()
    class Meta:
        model = Categoria
        fields = ['id', 'nome_categoria', 'nome_plural', 'loja', 'primeira_imagem']

    def get_primeira_imagem(self, obj):
        primeira_imagem_obj = obj.imagens.first()
        if primeira_imagem_obj:
            request = self.context.get('request')
            # build_absolute_uri garante que a URL completa seja retornada
            return request.build_absolute_uri(primeira_imagem_obj.imagem.url) if request else primeira_imagem_obj.imagem.url
        return None

#== Endpoints: /produtos E /categorias/{id} ==#
class ProdutoListSerializer(serializers.ModelSerializer):
    """ Serializer reduzido para listas de produtos. """
    categorias = CategoriaNestedSerializer(many=True, read_only=True)
    primeira_imagem = serializers.SerializerMethodField()
    class Meta:
        model = Produto
        fields = ['id', 'nome', 'preco', 'categorias', 'primeira_imagem']

    def get_primeira_imagem(self, obj):
        primeira_imagem_obj = obj.imagens.first()
        if primeira_imagem_obj:
            request = self.context.get('request')
            return request.build_absolute_uri(primeira_imagem_obj.imagem.url) if request else primeira_imagem_obj.imagem.url
        return None

#== Endpoint: /produtos/{id} ==#
class ProdutoDetailSerializer(serializers.ModelSerializer):
    """ Serializer completo para a página de detalhes de um produto. """
    categorias = CategoriaNestedSerializer(many=True, read_only=True)
    imagens = ImagemProdutoSerializer(many=True, read_only=True)
    detalhes = DetalheProdutoSerializer(many=True, read_only=True, source='detalheproduto_set')
    tamanhos = TamanhoProdutoSerializer(many=True, read_only=True, source='tamanhoproduto_set')
    class Meta:
        model = Produto
        fields = [
            'id', 'nome', 'descricao', 'preco', 'qtd_disponivel', 
            'peso', 'comprimento', 'largura', 'altura', 'dias_para_disponibilizar',
            'categorias', 'imagens', 'detalhes', 'tamanhos'
        ]

#== Endpoint: /cotar-frete (POST) ==#
class FreteItemSerializer(serializers.Serializer):
    """ Serializer auxiliar para validar cada item dentro da lista de cotação. """
    produto_id = serializers.UUIDField(required=True)
    quantidade = serializers.IntegerField(min_value=1, required=True)

class FreteQuoteSerializer(serializers.Serializer):
    """
    Serializer para o endpoint de cotação de frete.
    Recebe um CEP de destino e uma lista de itens do carrinho.
    """
    cep_destino = serializers.CharField(max_length=9, required=True)
    itens = FreteItemSerializer(many=True, required=True, allow_empty=False)

    def validate(self, data):
        itens_data = data['itens']
        cep_destino_clean = data['cep_destino'].replace('-', '')

        # --- VALIDAÇÃO DO ENDEREÇO DE ORIGEM ---
        loja_endereco = Endereco.objects.filter(loja__isnull=False).first()
        if not loja_endereco or not loja_endereco.cep:
            raise serializers.ValidationError("A loja não possui um endereço de origem com CEP cadastrado.")
        
        cep_origem_clean = loja_endereco.cep.replace('-', '')

        # --- PREPARAÇÃO DOS PRODUTOS PARA A API EXTERNA ---
        produtos_para_api = []
        produto_ids = [item['produto_id'] for item in itens_data]

        # Busca todos os produtos de uma só vez para otimizar
        produtos_db = Produto.objects.in_bulk(produto_ids)

        if len(produtos_db) != len(set(produto_ids)):
            raise serializers.ValidationError("Um ou mais IDs de produto são inválidos.")

        for item in itens_data:
            produto = produtos_db.get(item['produto_id'])

            # Validação de robustez para cada produto
            if not all([produto.altura, produto.largura, produto.comprimento, produto.peso]):
                raise serializers.ValidationError(f"O produto '{produto.nome}' está com dados de dimensão ou peso faltando.")

            produtos_para_api.append({
                "id": str(produto.id),
                "width": float(produto.largura),
                "height": float(produto.altura),
                "length": float(produto.comprimento),
                "weight": float(produto.peso),
                "insurance_value": float(produto.preco),
                "quantity": item['quantidade']
            })

        # --- MONTAGEM DO PAYLOAD E CHAMADA À API ---
        # A API da Melhor Envio espera uma chave "products" para múltiplos itens
        payload = {
            "from": {"postal_code": cep_origem_clean},
            "to": {"postal_code": cep_destino_clean},
            "products": produtos_para_api
        }
        
        headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {settings.MELHOR_ENVIO_TOKEN}',
            'User-Agent': f'{settings.MELHOR_ENVIO_NAME} ({settings.MELHOR_ENVIO_EMAIL})'
        }

        try:
            url_calculo = f"{settings.MELHOR_ENVIO_BASE_URL}/api/v2/me/shipment/calculate"
            response = requests.post(url_calculo, headers=headers, data=json.dumps(payload))
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            error_details = str(e)
            if e.response:
                try:
                    error_details = e.response.json()
                except json.JSONDecodeError:
                    error_details = e.response.text
            raise serializers.ValidationError(f"Erro ao cotar frete com a Melhor Envio: {error_details}")

#======================================================================
# 3. SERIALIZERS PARA O FLUXO DE PEDIDO (/pedidos POST)
#======================================================================

#== Serializers de Entrada de Dados (o que o frontend envia) ==#
class ItemPedidoInputSerializer(serializers.Serializer):
    tamanho_id = serializers.UUIDField(required=True)
    quantidade = serializers.IntegerField(min_value=1, required=True)

class FreteEscolhidoInputSerializer(serializers.Serializer):
    transportadora = serializers.CharField(max_length=32)
    servico_id = serializers.IntegerField()
    preco_frete = serializers.DecimalField(max_digits=12, decimal_places=2)
    entrega_estimada_dias = serializers.IntegerField()

class ContatoClienteInputSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contato
        fields = ['nome', 'sobrenome', 'cpf', 'email', 'whatsapp']

class EnderecoEntregaInputSerializer(serializers.ModelSerializer):
    class Meta:
        model = Endereco
        fields = ['cep', 'logradouro', 'numero', 'complemento', 'bairro', 'cidade', 'uf']

#== Serializer Principal para a Criação do Pedido ==#
class PedidoCreateSerializer(serializers.Serializer):
    """
    Serializer para criar um novo pedido. Recebe todos os dados do frontend, 
    valida o estoque, cria os objetos no banco de forma atômica e gera o
    pagamento no Mercado Pago, retornando o pedido com a URL de pagamento.
    """
    contato_cliente = ContatoClienteInputSerializer()
    endereco_entrega = EnderecoEntregaInputSerializer()
    itens = ItemPedidoInputSerializer(many=True, allow_empty=False)
    frete_escolhido = FreteEscolhidoInputSerializer()

    def create(self, validated_data):
        # 1. SEPARAÇÃO DOS DADOS DE ENTRADA
        itens_data = validated_data['itens']
        endereco_data = validated_data['endereco_entrega']
        contato_data = validated_data['contato_cliente']
        frete_data = validated_data['frete_escolhido']

        # 2. VALIDAÇÃO DE ESTOQUE (ANTES DE INICIAR A TRANSAÇÃO)
        for item_data in itens_data:
            try:
                tamanho_produto = TamanhoProduto.objects.select_related('produto').get(pk=item_data['tamanho_id'])
                if item_data['quantidade'] > (tamanho_produto.produto.qtd_disponivel - tamanho_produto.produto.qtd_em_compra):
                    raise serializers.ValidationError(f"Estoque insuficiente para o produto '{tamanho_produto.produto.nome}'.")
            except TamanhoProduto.DoesNotExist:
                raise serializers.ValidationError(f"Item com ID {item_data['tamanho_id']} não encontrado.")
        
        # 3. TRANSAÇÃO ATÔMICA (GARANTE A INTEGRIDADE DOS DADOS)
        with transaction.atomic():
            # 3.1. Cria ou busca o Contato do cliente
            contato, _ = Contato.objects.get_or_create(cpf=contato_data['cpf'], defaults=contato_data)
            
            # 3.2. Cria as outras entidades do pedido
            endereco = Endereco.objects.create(**endereco_data)
            info_entrega = InformacoesEntrega.objects.create(
                entrega_estimada=date.today() + timedelta(days=frete_data['entrega_estimada_dias']),
                transportadora=frete_data['transportadora'],
                servico_id=frete_data['servico_id'],
                preco_frete=frete_data['preco_frete'],
                rastreador='Aguardando Postagem'
            )
            pedido = Pedido.objects.create(
                contato_cliente=contato,
                endereco_entrega=endereco,
                info_entrega=info_entrega,
                status='A'
            )

            # 3.3. Cria os Itens do Pedido e deduz o estoque de forma segura
            for item_data in itens_data:
                tamanho_produto = TamanhoProduto.objects.get(id=item_data['tamanho_id'])
                produto_estoque = tamanho_produto.produto
                
                ItemPedido.objects.create(
                    pedido=pedido,
                    produto=produto_estoque,
                    tamanho=tamanho_produto,
                    quantidade=item_data['quantidade'],
                    preco_unitario_congelado=produto_estoque.preco
                )
                
                # ATUALIZAÇÃO SEGURA DO ESTOQUE:
                # Usar F() evita race conditions (problemas de concorrência).
                produto_estoque.qtd_disponivel = F('qtd_disponivel') - item_data['quantidade']
                produto_estoque.save(update_fields=['qtd_disponivel'])

        # 4. GERAÇÃO DO PAGAMENTO (MERCADO PAGO) - Com Debug Adicional
        try:
            sdk = mercadopago.SDK(settings.MERCADOPAGO_ACCESS_TOKEN)
            items_para_mp = [
                {
                    "title": item.produto.nome, 
                    "quantity": item.quantidade, 
                    "unit_price": float(item.preco_unitario_congelado), 
                    "currency_id": "BRL"
                } for item in pedido.itens.all()
            ]
            items_para_mp.append({
                "title": "Frete", "quantity": 1, 
                "unit_price": float(info_entrega.preco_frete), "currency_id": "BRL"
            })
            preference_data = {
                "items": items_para_mp,
                "payer": {"name": contato.nome, "surname": contato.sobrenome, "email": contato.email},
                "back_urls": {
                    "success": f"{settings.FRONTEND_BASE_URL}/pagamento/sucesso",
                    "failure": f"{settings.FRONTEND_BASE_URL}/pagamento/falha",
                    "pending": f"{settings.FRONTEND_BASE_URL}/pagamento/pendente"
                },
                "auto_return": "approved",
                "external_reference": str(pedido.id),
            }
            
            # --- INÍCIO DO BLOCO DE DEBUG ---
            print("="*50)
            print("DEBUG: DADOS ENVIADOS PARA O MERCADO PAGO")
            import pprint
            pprint.pprint(preference_data)
            print("="*50)

            # Chamada à API
            preference_response = sdk.preference().create(preference_data)

            # --- NOVO DEBUG: VAMOS VER A RESPOSTA COMPLETA DA SDK ---
            print("="*50)
            print("DEBUG: RESPOSTA COMPLETA RECEBIDA DO MERCADO PAGO")
            pprint.pprint(preference_response)
            print("="*50)
            # --- FIM DO NOVO DEBUG ---

            # Verificação para garantir que a resposta foi bem-sucedida antes de continuar
            if preference_response.get("status") not in [200, 201]:
                # Se não foi sucesso, lança uma exceção com a resposta completa para o nosso 'except' tratar
                raise Exception(f"A API do Mercado Pago retornou um erro: {preference_response}")

            preference = preference_response["response"]
            
            pedido.id_pagamento_externo = preference["id"]
            pedido.url_pagamento = preference.get("init_point") or preference.get("sandbox_init_point")
            pedido.save()

        except Exception as e:
            # --- LÓGICA DE TRATAMENTO DE FALHA APRIMORADA ---
            # O objeto de exceção da SDK do Mercado Pago pode conter mais detalhes
            error_details = getattr(e, 'response', str(e))

            # --- INÍCIO DO BLOCO DE DEBUG ---
            print("="*50)
            print("!!! ERRO NA API DO MERCADO PAGO !!!")
            print(f"Tipo da exceção: {type(e)}")
            print(f"Detalhes completos do erro: {error_details}")
            print("="*50)
            # --- FIM DO BLOCO DE DEBUG ---

            for item in pedido.itens.all():
                produto_a_estornar = item.produto
                produto_a_estornar.qtd_disponivel = F('qtd_disponivel') + item.quantidade
                produto_a_estornar.save(update_fields=['qtd_disponivel'])

            pedido.status = 'R'
            pedido.save(update_fields=['status'])

            raise serializers.ValidationError(
                f"O pedido foi registrado, mas falhou ao gerar o pagamento. O estoque foi restaurado. Erro: {error_details}"
            )
            
        return pedido

#== Serializer de Resposta para o Pedido Criado ==#
class PedidoReadOnlySerializer(serializers.ModelSerializer):
    """
    Serializer para formatar a resposta enviada ao frontend após a criação
    de um pedido, contendo principalmente a URL de pagamento.
    """
    status = serializers.CharField(source='get_status_display')
    class Meta:
        model = Pedido
        fields = ['id', 'status', 'url_pagamento', 'data_hora_criacao']