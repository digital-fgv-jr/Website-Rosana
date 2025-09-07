# Admin v5.1.0

from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from .models import (
    Endereco, Contato, ContatoLoja, InformacoesEntrega,
    Loja, Categoria, Produto, DetalheProduto, Imagem,
    Tamanho, TamanhoProduto, Carrinho, Pedido, ItemPedido,
    ProdutoCarrinho, ImagemProduto
)


# --- Models mais simples --- #
admin.site.register(Loja)
admin.site.register(Categoria)
admin.site.register(Tamanho)
admin.site.register(Imagem)

# --- Endereço e Contato --- #
@admin.register(Endereco)
class Enderecos(admin.ModelAdmin):
    list_display = ('id', 'logradouro', 'bairro', 'cidade', 'uf', 'cep',)
    list_display_links = ('id', 'cep', 'logradouro',)
    list_per_page = 20
    search_fields = ('logradouro', 'bairro', 'cidade', 'uf', 'cep',)

class ContatoLojaInline(admin.StackedInline):
    model = ContatoLoja
    can_delete = False
    verbose_name_plural = 'Informações de contato da Loja'

@admin.register(Contato)
class Contatos(admin.ModelAdmin):
    list_display = ('id', 'nome', 'sobrenome', 'cpf', 'email', 'is_loja',)
    list_display_links = ('id', 'cpf', 'email',)
    list_per_page = 20
    search_fields = ('nome', 'sobrenome', 'cpf', 'email',)
    
    inlines = [ContatoLojaInline]

    @admin.display(description='Contato de Loja?', boolean=True)
    def is_loja(self, obj):
        return hasattr(obj, 'contatoloja')

# --- Produto --- #
class ImagemProdutoInline(admin.TabularInline):
    model = ImagemProduto
    extra = 1 

class TamanhoProdutoInline(admin.TabularInline):
    model = TamanhoProduto
    extra = 1

class DetalheProdutoInline(admin.TabularInline):
    model = DetalheProduto
    extra = 1

@admin.register(Produto)
class Produtos(admin.ModelAdmin):
    list_display = ('id', 'nome', 'categoria', 'preco', 'qtd_disponivel',)
    list_filter = ('categoria',)
    list_per_page = 20
    search_fields = ('nome', 'descricao',)
    inlines = [DetalheProdutoInline, ImagemProdutoInline, TamanhoProdutoInline]

# --- Pedido --- #
class ItemPedidoInline(admin.TabularInline):
    model = ItemPedido
    readonly_fields = ('produto', 'tamanho', 'quantidade', 'preco_unitario_congelado',)
    extra = 0
    can_delete = False

    def has_add_permission(self, request, obj=None):
        return False

@admin.register(Pedido)
class Pedidos(admin.ModelAdmin):
    list_display = ('id', 'contato_cliente', 'status', 'data_hora_criacao', 'link_para_entrega',)
    list_filter = ('status',)
    list_per_page = 20
    search_fields = ('id', 'contato_cliente__nome', 'contato_cliente__cpf',)
    readonly_fields = ('contato_cliente', 'endereco_entrega', 'info_entrega', 
                       'data_hora_criacao', 'id_pagamento_externo', 'url_pagamento',)
    inlines = [ItemPedidoInline]

    @admin.display(description='Info Entrega')
    def link_para_entrega(self, obj):
        if obj.info_entrega:
            # Cria a URL para a página de admin do objeto info_entrega
            url = reverse('admin:core_informacoesentrega_change', args=[obj.info_entrega.id])
            return format_html(f'<a href="{url}">Ver Entrega #{obj.info_entrega.id}</a>')
        return "N/A"

@admin.register(InformacoesEntrega)
class InformacoesEntregas(admin.ModelAdmin):
    list_display = ('id', 'entrega_estimada', 'transportadora', 'rastreador', 'preco_frete', 'data_hora_finalizado',)
    list_display_links = ('id', 'transportadora', 'rastreador', 'data_hora_finalizado',)
    list_per_page = 20
    search_fields = ('transportadora', 'rastreador', 'data_hora_finalizado',)
