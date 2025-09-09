# Admin 12.3.2

from django.contrib import admin
from django.utils.html import format_html
from django import forms

from .models import (
    Endereco, Contato, ContatoLoja, ContatoNormal, ContatoDeLoja,
    InformacoesEntrega, Loja, Categoria, Produto, DetalheProduto, 
    Imagem, Tamanho, TamanhoProduto, Pedido, ItemPedido, ImagemProduto
)

## FINALIZADO ##
@admin.register(Endereco)
class Enderecos(admin.ModelAdmin):
    list_display = ('get_endereco_completo', 'complemento')
    list_display_links = ('get_endereco_completo', 'complemento')
    list_per_page = 20
    search_fields = ('id', 'cep', 'logradouro', 'bairro', 'cidade', 'uf', 'get_endereco_completo',)

    class Media:
        js = (
            'core/js/cep_mask.js',
        )
    
    @admin.display(description='Endereço')
    def get_endereco_completo(self, obj):
        return f'{obj.logradouro}, {obj.numero}. {obj.bairro}, {obj.cidade} - {obj.uf}'
    
class ContatoLojaInline(admin.StackedInline):
    model = ContatoLoja
    can_delete = False
    min_num = 1
    max_num = 1

## FINALIZADO ##
@admin.register(ContatoNormal)
class ContatoNormais(admin.ModelAdmin):
    list_display = ('get_nome_completo', 'cpf', 'email')
    search_fields = ('nome', 'sobrenome', 'cpf', 'email', 'id')
    list_display_links = ('get_nome_completo', 'email', 'cpf',)
    list_per_page = 20
    def get_queryset(self, request):
        return super().get_queryset(request).filter(contatoloja__isnull=True)
    
    @admin.display(description='Nome Completo')
    def get_nome_completo(self, obj):
        return f'{obj.nome} {obj.sobrenome}'

    class Media:
        js = (
            'core/js/contato_masks.js', 
        )

## FINALIZADO ##
@admin.register(ContatoDeLoja)
class ContatoDeLojas(admin.ModelAdmin):
    list_display = ('get_nome_completo', 'get_instagram', 'email', 'get_telefone',)
    search_fields = ('nome', 'sobrenome', 'cpf', 'email', 'get_instagram', 'get_telefone', 'id',)
    list_display_links = ('get_nome_completo', 'get_instagram', 'email', 'get_telefone',)
    inlines = [ContatoLojaInline]
    def get_queryset(self, request):
        return super().get_queryset(request).filter(contatoloja__isnull=False)
    
    @admin.display(description='Nome da Loja')
    def get_nome_completo(self, obj):
        return f'{obj.nome} {obj.sobrenome}'
    
    @admin.display(description='Instagram')
    def get_instagram(self, obj):
        return obj.contatoloja.instagram

    @admin.display(description='Telefone')
    def get_telefone(self, obj):
        return obj.contatoloja.telefone

    class Media:
        js = (
            'core/js/contato_masks.js', 
        )

## FINALIZADO ##
@admin.register(Imagem)
class Imagens(admin.ModelAdmin):
    list_display = ('titulo', 'preview_da_imagem',)
    readonly_fields = ('preview_da_imagem',)
    list_display_links = ('titulo', 'preview_da_imagem',)
    search_fields = ('id', 'titulo', 'imagem')
    list_per_page = 20

    def preview_da_imagem(self, obj):
        return format_html('<img src="{0}" width="auto" height="150px" />'.format(obj.imagem.url))

## FINALIZADO ##
@admin.register(InformacoesEntrega)
class InformacoesEntregas(admin.ModelAdmin):
    list_display = ('rastreador', 'transportadora', 'preco_frete', 'data_hora_finalizado',)
    readonly_fields = ('rastreador', 'transportadora', 'preco_frete', 'entrega_estimada', 'data_hora_finalizado',)
    list_display_links = ('rastreador', 'transportadora', 'preco_frete', 'data_hora_finalizado',)
    list_per_page = 20

    def has_add_permission(self, request):
        return False

class ContatoLojaInlineForm(forms.ModelForm):
    nome = forms.CharField(label='Nome', max_length=64)
    sobrenome = forms.CharField(label='Sobrenome', max_length=128, required=False)
    cpf = forms.CharField(label='CPF', max_length=11)
    email = forms.EmailField(label='E-mail', max_length=128)

    class Meta:
        model = ContatoLoja
        fields = ['nome', 'sobrenome', 'cpf', 'email', 'whatsapp', 'telefone', 'instagram', 'cnpj']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance and self.instance.pk and hasattr(self.instance, 'contato'):
            contato = self.instance.contato
            self.initial['nome'] = contato.nome
            self.initial['sobrenome'] = contato.sobrenome
            self.initial['cpf'] = contato.cpf
            self.initial['email'] = contato.email

class ContatoLojaAdminInline(admin.StackedInline):
    model = ContatoLoja
    form = ContatoLojaInlineForm
    can_delete = False
    min_num = 1
    max_num = 1

class EnderecoAdminInline(admin.StackedInline):
    model = Endereco
    can_delete = False
    min_num = 1
    max_num = 1

## FINALIZADO ##
@admin.register(Loja)
class Lojas(admin.ModelAdmin):
    list_display = ('apelido', 'get_contato_email', 'get_endereco_principal')
    list_display_links = ('apelido',)
    search_fields = ('apelido', 'contatoloja__contato__nome', 'contatoloja__contato__email')
    inlines = [ContatoLojaAdminInline, EnderecoAdminInline]

    def save_formset(self, request, form, formset, change):
        instances = formset.save(commit=False)

        for instance in instances:
            if isinstance(instance, ContatoLoja) and formset.cleaned_data:
                contato_data = {
                    'nome': formset.cleaned_data[0].get('nome'),
                    'sobrenome': formset.cleaned_data[0].get('sobrenome'),
                    'cpf': formset.cleaned_data[0].get('cpf'),
                    'email': formset.cleaned_data[0].get('email'),
                }
                
                if instance.pk and hasattr(instance, 'contato'):
                    Contato.objects.filter(pk=instance.contato.pk).update(**contato_data)
                    contato_obj = instance.contato
                else:
                    contato_obj = Contato.objects.create(**contato_data)
                
                instance.contato = contato_obj
        
        formset.save()
        formset.save_m2m()

    @admin.display(description='E-mail do Contato')
    def get_contato_email(self, obj):
        if hasattr(obj, 'contatoloja'):
            return obj.contatoloja.contato.email
        return "Nenhum"

    @admin.display(description='Endereço Principal')
    def get_endereco_principal(self, obj):
        endereco = obj.endereco_set.first()
        if endereco:
            return f"{endereco.logradouro}, {endereco.numero}"
        return "Nenhum"
    
    class Media:
        js = (
            'core/js/contato_masks_inline.js',
            'core/js/cep_mask_inline.js'
        )
    
## FINALIZADO ##
@admin.register(Categoria)
class Categorias(admin.ModelAdmin):
    list_display = ('get_categoria',)
    list_display_links = ('get_categoria',)
    search_fields = ('id', 'nome_categoria',)

    @admin.display(description='Categoria')
    def get_categoria(self, obj):
        return obj.nome_categoria

## FINALIZADO ##
@admin.register(Tamanho)
class Tamanhos(admin.ModelAdmin):
    list_display = ('nome', 'valor')
    list_display_links = ('nome', 'valor')
    search_fields = ('nome', 'valor')

class DetalheProdutoInline(admin.TabularInline):
    model = DetalheProduto
    extra = 1

class ImagemProdutoInline(admin.TabularInline):
    model = ImagemProduto
    extra = 1
    readonly_fields = ('preview_da_imagem_inline',)
    autocomplete_fields = ('imagem',)

    def preview_da_imagem_inline(self, obj):
        if obj.imagem:
            return format_html('<img src="{0}" width="auto" height="100px" />', obj.imagem.imagem.url)
        return "Nenhuma imagem selecionada"
    preview_da_imagem_inline.short_description = 'Preview'

class TamanhoProdutoInline(admin.TabularInline):
    model = TamanhoProduto
    autocomplete_fields = ('tamanho',)
    extra = 1

## FINALIZADO ##
@admin.register(Produto)
class Produtos(admin.ModelAdmin):
    list_display = ('id', 'nome', 'categoria', 'preco', 'preview_da_imagem_lista')
    list_display_links = ('id', 'nome', 'categoria', 'preview_da_imagem_lista',)
    list_filter = ('categoria',)
    search_fields = ('nome', 'descricao', 'categoria__nome_categoria', 'loja__apelido')
    list_per_page = 20
    exclude=('qtd_em_compra',)
    
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

## FINALIZADO## 
@admin.register(Pedido)
class Pedidos(admin.ModelAdmin):
    list_display = ('id', 'contato_cliente', 'status', 'data_hora_criacao', 'valor_total_do_pedido')
    list_display_links = ('id', 'contato_cliente',)
    list_filter = ('status',)
    search_fields = ('id', 'status', 'contato_cliente__nome', 'contato_cliente__cpf')
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

