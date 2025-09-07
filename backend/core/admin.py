# Admin 8.0.0

from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.http import HttpResponseRedirect
from .models import (
    Endereco, Contato, ContatoLoja, ContatoNormal, ContatoDeLoja,
    InformacoesEntrega, Loja, Categoria, Produto, DetalheProduto, 
    Imagem, Tamanho, TamanhoProduto, Carrinho, Pedido, 
    ItemPedido, ProdutoCarrinho, ImagemProduto
)

@admin.register(Endereco)
class Enderecos(admin.ModelAdmin):
    list_display = ('id', 'cep', 'logradouro', 'bairro', 'cidade', 'uf',)
    list_display_links = ('id', 'cep', 'logradouro',)
    list_per_page = 20
    search_fields = ('logradouro', 'bairro', 'cidade', 'uf', 'cep',)

    class Media:
        js = (
            'core/js/cep_mask.js', 
        )

class ContatoLojaInline(admin.StackedInline):
    model = ContatoLoja
    can_delete = False
    min_num = 1
    max_num = 1

@admin.register(ContatoNormal)
class ContatoNormais(admin.ModelAdmin):
    list_display = ('nome', 'sobrenome', 'cpf', 'email')
    search_fields = ('nome', 'sobrenome', 'cpf', 'email')
    def get_queryset(self, request):
        return super().get_queryset(request).filter(contatoloja__isnull=True)

@admin.register(ContatoDeLoja)
class ContatoDeLojas(admin.ModelAdmin):
    list_display = ('nome', 'sobrenome', 'cpf', 'email')
    search_fields = ('nome', 'sobrenome', 'cpf', 'email')
    inlines = [ContatoLojaInline]
    def get_queryset(self, request):
        return super().get_queryset(request).filter(contatoloja__isnull=False)

@admin.register(Imagem)
class Imagens(admin.ModelAdmin):
    list_display = ('id', 'titulo','preview_da_imagem',)
    readonly_fields = ('preview_da_imagem',)

    def preview_da_imagem(self, obj):
        return format_html('<img src="{0}" width="auto" height="150px" />'.format(obj.imagem.url))

@admin.register(InformacoesEntrega)
class InformacoesEntregas(admin.ModelAdmin):
    list_display = ('id', 'rastreador', 'transportadora', 'preco_frete', 'data_hora_finalizado',)
    readonly_fields = ('rastreador', 'transportadora', 'preco_frete', 'entrega_estimada', 'data_hora_finalizado',)

@admin.register(Loja)
class Lojas(admin.ModelAdmin):
    list_display = ('id', 'apelido', 'contato', 'endereco')
    search_fields = ('apelido',)
    raw_id_fields = ('contato', 'endereco',)

@admin.register(Categoria)
class Categorias(admin.ModelAdmin):
    list_display = ('id', 'loja', 'nome_categoria')
    search_fields = ('nome_categoria',)

admin.site.register(Tamanho)

class DetalheProdutoInline(admin.TabularInline):
    model = DetalheProduto
    extra = 1

class ImagemProdutoInline(admin.TabularInline):
    model = ImagemProduto
    extra = 1
    readonly_fields = ('preview_da_imagem_inline',)
    raw_id_fields = ('imagem',)

    def preview_da_imagem_inline(self, obj):
        if obj.imagem:
            return format_html('<img src="{0}" width="auto" height="100px" />', obj.imagem.imagem.url)
        return "Nenhuma imagem selecionada"
    preview_da_imagem_inline.short_description = 'Preview'

class TamanhoProdutoInline(admin.TabularInline):
    model = TamanhoProduto
    raw_id_fields = ('tamanho',)
    extra = 1

@admin.register(Produto)
class Produtos(admin.ModelAdmin):
    list_display = ('id', 'nome', 'categoria', 'preco', 'preview_da_imagem_lista')
    list_filter = ('categoria',)
    search_fields = ('nome', 'descricao', 'categoria__nome_categoria', 'loja__apelido')
    list_per_page = 20
    
    inlines = [DetalheProdutoInline, ImagemProdutoInline, TamanhoProdutoInline]

    @admin.display(description='Imagem Principal')
    def preview_da_imagem_lista(self, obj):
        imagem_produto = obj.imagemproduto_set.first()
        if imagem_produto and imagem_produto.imagem:
            return format_html('<img src="{0}" width="auto" height="80px" />', imagem_produto.imagem.imagem.url)
        return "Sem Imagem"

class ItemPedidoInline(admin.TabularInline):
    model = ItemPedido
    verbose_name_plural = 'Itens do Pedido'
    
    readonly_fields = ('produto', 'tamanho', 'quantidade', 'preco_unitario_congelado', 'subtotal')
    
    can_delete = False
    extra = 0
    def has_add_permission(self, request, obj=None):
        return False
    def has_change_permission(self, request, obj=None):
        return False
        
    @admin.display(description='Subtotal')
    def subtotal(self, obj):
        resultado = obj.quantidade * obj.preco_unitario_congelado
        return f"R$ {resultado:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")
    
@admin.register(Pedido)
class PedidosAdmin(admin.ModelAdmin):
    list_display = ('id', 'contato_cliente', 'status', 'data_hora_criacao', 'valor_total_do_pedido')
    list_filter = ('status',)
    search_fields = ('id', 'contato_cliente__nome', 'contato_cliente__cpf')
    list_per_page = 20
    
    readonly_fields = (
        'id', 'contato_cliente', 'endereco_entrega', 'info_entrega', 
        'data_hora_criacao', 'id_pagamento_externo', 'url_pagamento',
        'valor_total_do_pedido'
    )
    
    inlines = [ItemPedidoInline]

    def has_add_permission(self, request):
        return False

    @admin.display(description='Valor Total', ordering='id')
    def valor_total_do_pedido(self, obj):
        total_produtos = 0
        for item in obj.itempedido_set.all():
            total_produtos += item.quantidade * item.preco_unitario_congelado
        preco_frete = 0
        if obj.info_entrega and obj.info_entrega.preco_frete:
            preco_frete = obj.info_entrega.preco_frete
        valor_final = total_produtos + preco_frete
        return f"R$ {valor_final:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")

