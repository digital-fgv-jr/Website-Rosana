# Serializers 12.9.0

from rest_framework import serializers
from django.conf import settings

from datetime import timedelta, date
from django.db import transaction
import requests
import mercadopago

from .models import (
    InformacoesEntrega, Loja, Endereco,
    Contato, ContatoLoja, ContatoNormal, 
    ContatoDeLoja, Categoria, Produto, 
    DetalheProduto, Tamanho, TamanhoProduto, 
    TamanhoProduto, Pedido, ItemPedido,
    Imagem, ImagemProduto
)

######################
## SERIALIZERS BASE ##
######################

## Propriedades Básicas
class ImagemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Imagem
        fields = ['id', 'titulo', 'imagem']

class TamanhoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tamanho
        fields = ['id', 'nome', 'valor']

class EnderecoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Endereco
        fields = ['id', 'cep', 'logradouro', 'numero', 'complemento', 'bairro', 'cidade', 'uf']

class ContatoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contato
        fields = ['id', 'nome', 'sobrenome', 'cpf', 'email']

class ContatoLojaSerializer(serializers.ModelSerializer):
    contato = ContatoSerializer()
    class Meta:
        model = ContatoLoja
        fields = ['contato', 'whatsapp', 'telefone', 'instagram', 'cnpj']

class ContatoLojaExclusiveInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContatoLoja
        fields = ['whatsapp', 'telefone', 'instagram', 'cnpj']

class ListaContatosNormaisSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContatoNormal
        fields = ['id', 'nome', 'sobrenome', 'cpf', 'email']

class ListaContatosLojaSerializer(serializers.ModelSerializer):
    contatoloja = ContatoLojaExclusiveInfoSerializer(read_only=True)
    class Meta:
        model = ContatoDeLoja
        fields = ['id', 'nome', 'sobrenome', 'cpf', 'email', 'contatoloja']

## Propriedades Produto

class DetalheProdutoSerializer(serializers.ModelSerializer):
    class Meta:
        model = DetalheProduto
        fields = ['id', 'propriedade', 'descricao']

class ImagemProdutoSerializer(serializers.ModelSerializer):
    imagem = ImagemSerializer(read_only=True)
    class Meta:
        model = ImagemProduto
        fields = ['id', 'imagem']

class TamanhoProdutoSerializer(serializers.ModelSerializer):
    tamanho = TamanhoSerializer(read_only=True)
    class Meta:
        model = TamanhoProduto
        fields = ['id', 'tamanho']

class CategoriaLiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ['id', 'nome_categoria']

#####################
## SERIALIZER LOJA ##
#####################

class LojaNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Loja
        fields = ['apelido']

class LojaInfoSerializer(serializers.ModelSerializer):
    endereco = EnderecoSerializer(read_only=True, many=True, source='endereco_set')
    contatoloja = ContatoLojaSerializer(read_only = True)
    class Meta:
        model = Loja
        fields = ['id', 'apelido', 'endereco', 'contatoloja']

class ListaCategoriasLoja(serializers.ModelSerializer):
    categorias = CategoriaLiteSerializer(read_only=True, many=True, source='categoria_set')
    class Meta:
        model = Loja
        fields = [
            'id',
            'apelido',
            'categorias'
        ]

#########################
## SERIALIZERS PRODUTO ##
#########################

class InformacoesTransporteSerializer(serializers.Serializer):
    peso = serializers.DecimalField(max_digits=10, decimal_places=2)
    comprimento = serializers.DecimalField(max_digits=10, decimal_places=2)
    largura = serializers.DecimalField(max_digits=10, decimal_places=2)
    altura = serializers.DecimalField(max_digits=10, decimal_places=2)
    dias_para_disponibilizar = serializers.IntegerField()

class ProdutoSerializer(serializers.ModelSerializer):
    categoria = CategoriaLiteSerializer(read_only=True)
    detalhes = DetalheProdutoSerializer(many=True, read_only=True, source='detalheproduto_set')
    imagens = ImagemProdutoSerializer(many=True, read_only=True, source='imagemproduto_set')
    tamanhos = TamanhoProdutoSerializer(many=True, read_only=True, source='tamanhoproduto_set')
    informacoes_transporte = InformacoesTransporteSerializer(source='*')
    disponivel_para_compra = serializers.SerializerMethodField()
    
    class Meta:
        model = Produto
        fields = [
            'id', 'nome', 'descricao', 'preco', 'qtd_disponivel',
            'categoria', 'detalhes', 'imagens', 'tamanhos',
            'informacoes_transporte', 'disponivel_para_compra',
        ]
    
    def get_disponivel_para_compra(self, obj):
        return obj.qtd_disponivel > obj.qtd_em_compra

class ListaProdutosCategoria(serializers.ModelSerializer):
    produtos = ProdutoSerializer(many=True, read_only=True, source='produto_set')
    class Meta:
        model = Categoria
        fields = [
            'id',
            'nome_categoria',
            'produtos',
        ]

#########################
## SERIALIZERS ENTREGA ##
#########################

class ProdutoLiteSerializer(serializers.ModelSerializer):
    imagem_principal_url = serializers.SerializerMethodField()
    disponivel_para_compra = serializers.SerializerMethodField()

    class Meta:
        model = Produto
        fields = ['id', 'nome', 'preco', 'imagem_principal_url', 'disponivel_para_compra']
    
    def get_imagem_principal_url(self, obj):
        imagem = obj.imagemproduto_set.first()
        if imagem:
            request = self.context.get('request')
            return request.build_absolute_uri(imagem.imagem.imagem.url)
        return None    
    def get_disponivel_para_compra(self, obj):
        return obj.qtd_disponivel > obj.qtd_em_compra

class ProdutoFreteInfoSerializer(serializers.ModelSerializer):
    informacoes_transporte = InformacoesTransporteSerializer(read_only=True, source='*')
    class Meta:
        model = Produto
        fields = ['id', 'nome', 'preco', 'informacoes_transporte']

class FreteItemInputSerializer(serializers.Serializer):
    tamanho_id = serializers.IntegerField(required=True)
    quantidade = serializers.IntegerField(required=True, min_value=1)

class FreteSerializer(serializers.Serializer):
    # CAMPOS DE ENTRADA (vindos do front)
    cep_destino = serializers.CharField(required=True, max_length=9)
    itens = FreteItemInputSerializer(many=True, required=True)
    cep_destino.write_only = True
    itens.write_only = True

    def validate(self, data):
        itens_data = data.get('itens')
        cep_destino_limpo = data.get('cep_destino').replace('-', '')

        produto_quantidades = {}
        items_para_frenet, valor_total_produtos = [], 0
        cep_origem = None
        max_dias_preparacao = 0

        for item_info in itens_data:
            try:
                tamanho_produto = TamanhoProduto.objects.select_related(
                    'produto' 
                ).prefetch_related(
                    'produto__categorias__loja__endereco_set' 
                ).get(id=item_info['tamanho_id'])
                
                produto = tamanho_produto.produto
            except TamanhoProduto.DoesNotExist:
                raise serializers.ValidationError(f"Tamanho de produto com ID {item_info['tamanho_id']} não encontrado.")

            if not cep_origem:
                primeira_categoria = produto.categorias.first()
                if not primeira_categoria:
                    raise serializers.ValidationError(f"O produto '{produto.nome}' não está associado a nenhuma categoria.")
                
                loja = primeira_categoria.loja
                loja_endereco = loja.endereco_set.first()
                if not loja_endereco:
                    raise serializers.ValidationError(f"A loja '{loja.apelido}' do produto '{produto.nome}' não possui um endereço de origem cadastrado.")
                
                cep_origem = loja_endereco.cep.replace('-', '')
            print('#'*200)
            print(cep_origem)
            
            produto_quantidades[produto.id] = produto_quantidades.get(produto.id, 0) + item_info['quantidade']
            max_dias_preparacao = max(max_dias_preparacao, produto.dias_para_disponibilizar)
            valor_total_produtos += item_info['quantidade'] * produto.preco
            items_para_frenet.append({
                "Weight": float(produto.peso), "Length": float(produto.comprimento),
                "Height": float(produto.altura), "Width": float(produto.largura),
                "Quantity": item_info['quantidade']
            })

        for produto_id, quantidade_total in produto_quantidades.items():
            produto = Produto.objects.get(id=produto_id)
            if quantidade_total > produto.qtd_disponivel:
                raise serializers.ValidationError(
                    f"Estoque insuficiente para '{produto.nome}'. Você está tentando comprar {quantidade_total}, "
                    f"mas apenas {produto.qtd_disponivel} estão disponíveis no total (para todos os tamanhos)."
                )

        payload_frenet = {
            "SellerCEP": cep_origem, "RecipientCEP": cep_destino_limpo,
            "ShipmentInvoiceValue": float(valor_total_produtos), "ShippingItemArray": items_para_frenet
        }
        headers_frenet = {"Accept": "application/json", "Content-Type": "application/json", "token": settings.FRENET_TOKEN}

        try:
            response_frenet = requests.post(settings.FRENET_API_URL, json=payload_frenet, headers=headers_frenet)
            response_frenet.raise_for_status()
            resultado = response_frenet.json()
            opcoes_frete = resultado.get('ShippingServicesArray', [])
            
            if not opcoes_frete or (opcoes_frete and opcoes_frete[0].get('Error')):
                raise serializers.ValidationError(f"Cálculo de frete falhou: {opcoes_frete[0].get('Msg', 'Verifique o CEP de destino')}")

            resultado_final = []
            for opcao in opcoes_frete:
                prazo_transportadora = int(opcao.get('DeliveryTime', '0'))
                prazo_total_dias = max_dias_preparacao + prazo_transportadora
                
                resultado_final.append({
                    "transportadora": opcao.get('ServiceDescription'),
                    "codigo_servico": opcao.get('ServiceCode'),
                    "preco_frete": opcao.get('ShippingPrice'),
                    "prazo_entrega_dias": prazo_total_dias,
                    "data_entrega_estimada": date.today() + timedelta(days=prazo_total_dias)
                })

            return resultado_final

        except requests.RequestException as e:
            raise serializers.ValidationError(f"Erro ao comunicar com a API de frete: {e}")

class InformacoesEntregaSerializer(serializers.ModelSerializer):
    class Meta:
        model = InformacoesEntrega
        fields = [
            'id',
            'entrega_estimada',
            'rastreador',
            'transportadora',
            'preco_frete',
            'data_hora_finalizado',
        ]

    def validate_entrega_estimada(self, value):
        if value < date.today():
            raise serializers.ValidationError("A data de entrega estimada não pode ser no passado.")
        return value

#########################
## SERIALIZERS PEDIDOS ##
#########################
class ItemPedidoSerializer(serializers.ModelSerializer):
    produto = ProdutoLiteSerializer(read_only=True)
    tamanho = TamanhoProdutoSerializer(read_only=True)
    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = ItemPedido
        fields = ['id', 'produto', 'tamanho', 'quantidade', 'preco_unitario_congelado', 'subtotal']

    def get_subtotal(self, obj):
        total = obj.quantidade * obj.preco_unitario_congelado
        return f"{total:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")

class FreteEscolhidoInputSerializer(serializers.Serializer):
    transportadora = serializers.CharField(required=True)
    preco_frete = serializers.DecimalField(required=True, max_digits=12, decimal_places=2)
    prazo_entrega_dias = serializers.IntegerField(required=True)
    data_entrega_estimada = serializers.DateField(required=True)

class PedidoSerializer(serializers.ModelSerializer):
    # Campos para GET
    contato_cliente = ContatoSerializer(read_only=True)
    endereco_entrega = EnderecoSerializer(read_only=True)
    info_entrega = InformacoesEntregaSerializer(read_only=True)
    itens = FreteItemInputSerializer(many=True, write_only=True)
    status = serializers.CharField(source='get_status_display', read_only=True)
    valor_total = serializers.SerializerMethodField()

    # Campos para POST
    itens = FreteItemInputSerializer(many=True, write_only=True)
    endereco_entrega_data = EnderecoSerializer(write_only=True)
    contato_cliente_data = ContatoSerializer(write_only=True, source='contato_cliente')
    frete_escolhido = FreteEscolhidoInputSerializer(write_only=True)

    class Meta:
        model = Pedido
        fields = [
            'id', 'status', 'data_hora_criacao', 'contato_cliente', 'endereco_entrega',
            'info_entrega', 'valor_total', 'url_pagamento', 'itens',
            'endereco_entrega_data', 'contato_cliente_data', 'frete_escolhido'
        ]

    def get_valor_total(self, obj):
        total_produtos = sum(item.quantidade * item.preco_unitario_congelado for item in obj.itens.all())
        preco_frete = obj.info_entrega.preco_frete if obj.info_entrega else 0
        return total_produtos + preco_frete
    
    def create(self, validated_data):
        # 1. SEPARAÇÃO DOS DADOS DE ENTRADA
        itens_data = validated_data.pop('itens')
        endereco_data = validated_data.pop('endereco_entrega_data')
        contato_data = validated_data.pop('contato_cliente_data')
        frete_data = validated_data.pop('frete_escolhido')

        # 2. CRIAÇÃO/BUSCA DO CONTATO (CHECKOUT DE CONVIDADO)
        contato, created = Contato.objects.get_or_create(
            cpf=contato_data['cpf'],
            defaults={
                'nome': contato_data['nome'],
                'sobrenome': contato_data['sobrenome'],
                'email': contato_data['email'],
            }
        )

        # 3. VALIDAÇÃO DE ESTOQUE COMPARTILHADO (PRÉ-TRANSAÇÃO)
        produto_quantidades = {}
        for item in itens_data:
            try:
                tamanho_produto = TamanhoProduto.objects.select_related('produto').get(id=item['tamanho_id'])
                produto_id = tamanho_produto.produto.id
                produto_quantidades[produto_id] = produto_quantidades.get(produto_id, 0) + item['quantidade']
            except TamanhoProduto.DoesNotExist:
                raise serializers.ValidationError(f"Tamanho de produto com ID {item['tamanho_id']} não encontrado.")

        for produto_id, quantidade_total in produto_quantidades.items():
            produto = Produto.objects.get(id=produto_id)
            if quantidade_total > produto.qtd_disponivel:
                raise serializers.ValidationError(f"Estoque insuficiente para '{produto.nome}'.")

        pedido = None
        # 4. TRANSAÇÃO ATÔMICA (OPERAÇÃO SEGURA NO BANCO)
        with transaction.atomic():
            endereco = Endereco.objects.create(**endereco_data)
            info_entrega = InformacoesEntrega.objects.create(
                entrega_estimada=frete_data['data_entrega_estimada'],
                transportadora=frete_data['transportadora'],
                preco_frete=frete_data['preco_frete'],
                rastreador='Aguardando envio'
            )
            pedido = Pedido.objects.create(
                contato_cliente=contato,
                endereco_entrega=endereco,
                info_entrega=info_entrega
            )
            for item_data in itens_data:
                tamanho_produto = TamanhoProduto.objects.get(id=item_data['tamanho_id'])
                ItemPedido.objects.create(
                    pedido=pedido, produto=tamanho_produto.produto, tamanho=tamanho_produto,
                    quantidade=item_data['quantidade'], preco_unitario_congelado=tamanho_produto.produto.preco
                )
                produto_estoque = tamanho_produto.produto
                produto_estoque.qtd_disponivel -= item_data['quantidade']
                produto_estoque.save()

        # 5. GERAÇÃO DO PAGAMENTO (MERCADO PAGO)
        if pedido:
            sdk = mercadopago.SDK(settings.MERCADOPAGO_ACCESS_TOKEN)
            items_para_mp = [{"title": item.produto.nome, "quantity": item.quantidade, "unit_price": float(item.preco_unitario_congelado), "currency_id": "BRL"} for item in pedido.itens.all()]
            items_para_mp.append({"title": "Frete", "quantity": 1, "unit_price": float(info_entrega.preco_frete), "currency_id": "BRL"})
            
            preference_data = {
                "items": items_para_mp,
                "payer": {"name": contato.nome, "surname": contato.sobrenome, "email": contato.email},
                "back_urls": {"success": f"{settings.FRONTEND_BASE_URL}/pagamento/sucesso", "failure": f"{settings.FRONTEND_BASE_URL}/pagamento/falha", "pending": f"{settings.FRONTEND_BASE_URL}/pagamento/pendente"},
                "auto_return": "approved",
                "external_reference": str(pedido.id),
            }
            preference_response = sdk.preference().create(preference_data)
            preference = preference_response["response"]
            
            pedido.id_pagamento_externo = preference["id"]
            pedido.url_pagamento = preference.get("init_point") or preference.get("sandbox_init_point")
            pedido.save()
            
        return pedido