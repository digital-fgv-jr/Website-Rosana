# Serializers v7.2.1

from datetime import date, timedelta
from rest_framework import serializers
from django.db import transaction
from .models import (
    Endereco, Contato, ContatoLoja, ContatoNormal, ContatoDeLoja,
    InformacoesEntrega, Loja, Categoria, Produto, DetalheProduto, 
    Imagem, Tamanho, TamanhoProduto, Carrinho, Pedido, 
    ItemPedido, ProdutoCarrinho, ImagemProduto
)
import requests
import mercadopago
from django.conf import settings

class EnderecoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Endereco
        fields = [
            'id', 
            'cep', 
            'logradouro', 
            'numero', 
            'complemento', 
            'bairro',
            'cidade',
            'uf',
        ]

class ContatoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contato
        fields = [
            'id',
            'nome',
            'sobrenome',
            'cpf',
            'email',
        ]
    
class ContatoLojaInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContatoLoja
        fields = [
            'contato',
            'whatsapp',
            'telefone',
            'instagram',
            'cnpj',
        ]

class ContatoNormalSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContatoNormal
        fields = [
            'id',
            'nome',
            'sobrenome',
            'cpf',
            'email',
        ]

class ContatoDeLojaSerializer(serializers.ModelSerializer):
    contatoloja = ContatoLojaInfoSerializer()
    
    class Meta:
        model = ContatoDeLoja
        fields = [
            'id',
            'nome',
            'sobrenome',
            'cpf',
            'email',
            'contatoloja',
        ]
    
    def create(self, validated_data):
        loja_data = validated_data.pop('contatoloja')
        contato_instance = Contato.objects.create(**validated_data)
        ContatoLoja.objects.create(contato=contato_instance, **loja_data)
        return contato_instance
    
    def update(self, instance, validated_data):
        loja_data = validated_data.pop('contatoloja', None)
        instance.nome = validated_data.get('nome', instance.nome)
        instance.sobrenome = validated_data.get('sobrenome', instance.sobrenome)
        instance.cpf = validated_data.get('cpf', instance.cpf)
        instance.email = validated_data.get('email', instance.email)
        instance.save()

        if loja_data:
            loja_instance = instance.contatoloja
            loja_instance.whatsapp = loja_data.get('whatsapp', loja_instance.whatsapp)
            loja_instance.telefone = loja_data.get('telefone', loja_instance.telefone)
            loja_instance.instagram = loja_data.get('instagram', loja_instance.instagram)
            loja_instance.cnpj = loja_data.get('cnpj', loja_instance.cnpj)
            loja_instance.save()

        return instance

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

class LojaSerializer(serializers.ModelSerializer):
    contato = ContatoDeLojaSerializer()
    endereco = EnderecoSerializer()
    class Meta:
        model = Loja
        fields = [
            'id',
            'apelido',
            'contato',
            'endereco',
        ]
    
    def create(self, validated_data):
        contato_data = validated_data.pop('contato')
        endereco_data = validated_data.pop('endereco')

        contato_serializer = ContatoDeLojaSerializer(data=contato_data)
        if contato_serializer.is_valid(raise_exception=True):
            contato_instance = contato_serializer.save()
        
        endereco_instance = Endereco.objects.create(**endereco_data)
        
        loja_instance = Loja.objects.create(
            contato=contato_instance,
            endereco=endereco_instance,
            **validated_data
        )
        
        return loja_instance

class LojaLiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Loja
        fields = ['id', 'apelido']

class CategoriaSerializer(serializers.ModelSerializer):
    loja = LojaLiteSerializer(read_only=True)

    loja_id = serializers.PrimaryKeyRelatedField(
        queryset=Loja.objects.all(), 
        source='loja', 
        write_only=True,
        label='ID da Loja'
    )

    class Meta:
        model = Categoria
        fields = [
            'id',
            'loja',
            'loja_id',
            'nome_categoria',
        ]
    
class ImagemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Imagem
        fields = [
            'id', 
            'titulo', 
            'imagem',
        ]

class TamanhoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tamanho
        fields = ['id', 'nome', 'valor']

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

class ProdutoSerializer(serializers.ModelSerializer):
    categoria = CategoriaSerializer(read_only=True)
    detalhes = DetalheProdutoSerializer(many=True, read_only=True, source='detalheproduto_set')
    imagens = ImagemProdutoSerializer(many=True, read_only=True, source='imagemproduto_set')
    tamanhos = TamanhoProdutoSerializer(many=True, read_only=True, source='tamanhoproduto_set')

    categoria_id = serializers.PrimaryKeyRelatedField(
        queryset=Categoria.objects.all(), source='categoria', write_only=True
    )
    imagens_ids = serializers.PrimaryKeyRelatedField(
        queryset=Imagem.objects.all(), many=True, write_only=True, source='imagemproduto_set', required=False
    )
    tamanhos_ids = serializers.PrimaryKeyRelatedField(
        queryset=Tamanho.objects.all(), many=True, write_only=True, source='tamanhoproduto_set', required=False
    )

    class Meta:
        model = Produto
        fields = [
            'id',
            'nome',
            'descricao',
            'preco',
            'qtd_disponivel',

            'categoria',
            'detalhes',
            'imagens',
            'tamanhos',
            
            'categoria_id',
            'imagens_ids',
            'tamanhos_ids',
            
            'peso',
            'comprimento',
            'largura',
            'altura',
        ]
    
    def create(self, validated_data):
        imagens_data = validated_data.pop('imagemproduto_set', [])
        tamanhos_data = validated_data.pop('tamanhoproduto_set', [])
        
        produto = Produto.objects.create(**validated_data)
        
        for imagem in imagens_data:
            ImagemProduto.objects.create(produto=produto, imagem=imagem)
            
        for tamanho in tamanhos_data:
            TamanhoProduto.objects.create(produto=produto, tamanho=tamanho)
            
        return produto

class ProdutoCarrinhoLiteSerializer(serializers.ModelSerializer):
    imagem_principal_url = serializers.SerializerMethodField()

    class Meta:
        model = Produto
        fields = [
            'id', 
            'nome', 
            'preco', 
            'imagem_principal_url'
        ]

    def get_imagem_principal_url(self, obj):
        imagem_produto = obj.imagemproduto_set.first()
        if imagem_produto and imagem_produto.imagem:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(imagem_produto.imagem.imagem.url)
        return None

class ProdutoCarrinhoSerializer(serializers.ModelSerializer):
    produto = ProdutoCarrinhoLiteSerializer(read_only=True)
    tamanho = TamanhoProdutoSerializer(read_only=True)

    class Meta:
        model = ProdutoCarrinho
        fields = [
            'id', 
            'produto', 
            'tamanho', 
            'quantidade'
        ]

class CarrinhoSerializer(serializers.ModelSerializer):
    itens = ProdutoCarrinhoSerializer(many=True, read_only=True, source='produtocarrinho_set')
    subtotal = serializers.SerializerMethodField()
    total_itens = serializers.SerializerMethodField()

    produto_id = serializers.IntegerField(write_only=True, required=False)
    tamanho_id = serializers.IntegerField(write_only=True, required=False)
    quantidade = serializers.IntegerField(write_only=True, required=False, min_value=0)

    class Meta:
        model = Carrinho
        fields = [
            'id', 'fechado', 'total_itens', 'subtotal', 'itens',
            'produto_id', 'tamanho_id', 'quantidade',
        ]
    
    def get_total_itens(self, obj):
        return sum(item.quantidade for item in obj.produtocarrinho_set.all())

    def get_subtotal(self, obj):
        subtotal = sum(item.quantidade * item.produto.preco for item in obj.produtocarrinho_set.all())
        return f"{subtotal:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")

    def update(self, instance, validated_data):
        produto_id = validated_data.get('produto_id')
        tamanho_id = validated_data.get('tamanho_id')
        quantidade = validated_data.get('quantidade')

        if instance.fechado:
            raise serializers.ValidationError("Não é possível modificar um carrinho fechado.")
        
        if not all([produto_id, tamanho_id, quantidade is not None]):
            raise serializers.ValidationError("Para modificar um item, 'produto_id', 'tamanho_id' e 'quantidade' são necessários.")

        try:
            produto = Produto.objects.get(id=produto_id)
            tamanho = TamanhoProduto.objects.get(id=tamanho_id, produto=produto)
        except (Produto.DoesNotExist, TamanhoProduto.DoesNotExist):
            raise serializers.ValidationError("Produto ou tamanho inválido.")

        item, created = ProdutoCarrinho.objects.get_or_create(
            carrinho=instance,
            produto=produto,
            tamanho=tamanho
        )

        if quantidade > 0:
            if quantidade > produto.qtd_disponivel:
                raise serializers.ValidationError(f"Estoque insuficiente. Apenas {produto.qtd_disponivel} unidades disponíveis.")
            item.quantidade = quantidade
            item.save()
        else:
            item.delete()

        return instance

"""

class ItemPedidoSerializer(serializers.ModelSerializer):
    produto = ProdutoCarrinhoLiteSerializer(read_only=True)
    tamanho = TamanhoProdutoSerializer(read_only=True)
    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = ItemPedido
        fields = [
            'id', 
            'produto', 
            'tamanho', 
            'quantidade', 
            'preco_unitario_congelado',
            'subtotal',
        ]

    def get_subtotal(self, obj):
        resultado = obj.quantidade * obj.preco_unitario_congelado
        return f"{resultado:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")

class PedidoSerializer(serializers.ModelSerializer):
    contato_cliente = ContatoNormalSerializer()
    endereco_entrega = EnderecoSerializer(read_only=True)
    info_entrega = InformacoesEntregaSerializer(read_only=True)
    itens = ItemPedidoSerializer(many=True, read_only=True)
    status = serializers.CharField(source='get_status_display', read_only=True)
    valor_total = serializers.SerializerMethodField()

    carrinho_id = serializers.IntegerField(write_only=True, label="ID do Carrinho")
    endereco_entrega_id = serializers.PrimaryKeyRelatedField(
        queryset=Endereco.objects.all(), source='endereco_entrega', write_only=True
    )

    class Meta:
        model = Pedido
        fields = [
            'id', 'status', 'data_hora_criacao', 'contato_cliente', 'endereco_entrega',
            'info_entrega', 'valor_total', 'url_pagamento', 'itens',
            'carrinho_id', 'endereco_entrega_id'
        ]

    def get_valor_total(self, obj):
        total_produtos = sum(item.quantidade * item.preco_unitario_congelado for item in obj.itens.all())
        preco_frete = obj.info_entrega.preco_frete if obj.info_entrega else 0
        valor_final = total_produtos + preco_frete
        return f"{valor_final:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")
    
    def create(self, validated_data):
        carrinho_id = validated_data.pop('carrinho_id')
        endereco = validated_data.pop('endereco_entrega')
        contato_data = validated_data.pop('contato_cliente')

        contato, created = Contato.objects.get_or_create(
            cpf=contato_data['cpf'],
            nome=contato_data['nome'],
            sobrenome=contato_data['sobrenome'],
            email=contato_data['email'],
        )

        try:
            carrinho = Carrinho.objects.get(id=carrinho_id)
        except Carrinho.DoesNotExist:
            raise serializers.ValidationError("Carrinho inválido.")

        if carrinho.fechado:
            raise serializers.ValidationError("Este carrinho já foi finalizado em um pedido.")
        
        itens_do_carrinho = carrinho.produtocarrinho_set.all()
        if not itens_do_carrinho.exists():
            raise serializers.ValidationError("Não é possível criar um pedido de um carrinho vazio.")

        items_para_frenet, valor_total_produtos = [], 0
        for item in itens_do_carrinho:
            if item.quantidade > item.produto.qtd_disponivel:
                raise serializers.ValidationError(f"Estoque insuficiente para {item.produto.nome}")
            valor_total_produtos += item.quantidade * item.produto.preco
            items_para_frenet.append({
                "Weight": float(item.produto.peso), "Length": float(item.produto.comprimento),
                "Height": float(item.produto.altura), "Width": float(item.produto.largura),
                "Quantity": item.quantidade
            })
        
        payload_frenet = {
            "SellerCEP": settings.FRENET_CEP_ORIGEM, "RecipientCEP": endereco.cep.replace('-', ''),
            "ShipmentInvoiceValue": float(valor_total_produtos), "ShippingItemArray": items_para_frenet
        }
        headers_frenet = {"Accept": "application/json", "Content-Type": "application/json", "token": settings.FRENET_TOKEN}
        
        try:
            response_frenet = requests.post(settings.FRENET_API_URL, json=payload_frenet, headers=headers_frenet)
            response_frenet.raise_for_status()
            opcoes_frete = response_frenet.json().get('ShippingServicesArray', [])
            if not opcoes_frete or opcoes_frete[0].get('Error'):
                raise serializers.ValidationError(f"Cálculo de frete falhou: {opcoes_frete[0].get('Msg', 'Erro')}")
            
            frete_escolhido = opcoes_frete[0]
            preco_frete = float(frete_escolhido.get('ShippingPrice', 0.0))
            transportadora = frete_escolhido.get('ServiceDescription', 'A Definir')
            prazo_dias = int(frete_escolhido.get('DeliveryTime', '0'))
            entrega_estimada = date.today() + timedelta(days=prazo_dias)
        except requests.RequestException as e:
            raise serializers.ValidationError(f"Erro ao comunicar com a API de frete: {e}")

        pedido = None
        
        with transaction.atomic():
            info_entrega = InformacoesEntrega.objects.create(
                entrega_estimada=entrega_estimada, transportadora=transportadora,
                preco_frete=preco_frete, rastreador='Aguardando envio'
            )
            pedido = Pedido.objects.create(
                contato_cliente=contato, endereco_entrega=endereco,
                info_entrega=info_entrega, **validated_data
            )
            for item_carrinho in itens_do_carrinho:
                ItemPedido.objects.create(
                    pedido=pedido, produto=item_carrinho.produto, tamanho=item_carrinho.tamanho,
                    quantidade=item_carrinho.quantidade, preco_unitario_congelado=item_carrinho.produto.preco
                )
                produto_estoque = item_carrinho.produto
                produto_estoque.qtd_disponivel -= item_carrinho.quantidade
                produto_estoque.save()
            
            carrinho.fechado = True
            carrinho.save()

        
        if pedido:
            sdk = mercadopago.SDK(settings.MERCADOPAGO_ACCESS_TOKEN)
            items_para_mp = [{"title": item.produto.nome, "quantity": item.quantidade, "unit_price": float(item.preco_unitario_congelado), "currency_id": "BRL"} for item in pedido.itens.all()]
            items_para_mp.append({"title": "Frete", "quantity": 1, "unit_price": float(preco_frete), "currency_id": "BRL"})
            
            preference_data = {
                "items": items_para_mp,
                "payer": {"name": contato.nome, "surname": contato.sobrenome, "email": contato.email},
                "back_urls": {"success": "https://www.seusite.com/pagamento/sucesso", "failure": "https://www.seusite.com/pagamento/falha", "pending": "https://www.seusite.com/pagamento/pendente"},
                "auto_return": "approved",
                "external_reference": str(pedido.id),
            }
            preference_response = sdk.preference().create(preference_data)
            preference = preference_response["response"]
            
            pedido.id_pagamento_externo = preference["id"]
            pedido.url_pagamento = preference.get("init_point") or preference.get("sandbox_init_point")
            pedido.save()
            
        return pedido

"""

class ListaCategoriasLojaSerializer(serializers.ModelSerializer):
    produtos = ProdutoSerializer(many=True, read_only=True, source='produto_set')
    
    class Meta:
        model = Categoria
        fields = [
            'id',
            'nome_categoria',
            'produtos',
        ]

class ListaProdutosCategoriaSerializer(serializers.ModelSerializer):
    produtos = ProdutoSerializer(many=True, read_only=True, source='produto_set')

    class Meta:
        model = Categoria
        fields = [
            'id',
            'nome_categoria',
        ]


