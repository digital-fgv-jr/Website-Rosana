# Admin v13.14.1

from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
from django.shortcuts import redirect

from django.conf import settings
from django.template.response import TemplateResponse
import requests # Você precisará instalar: pip install requests
import json

from .models import (
    Endereco, Contato, ContatoLoja, ContatoNormal, ContatoDeLoja,
    InformacoesEntrega, Loja, Categoria, Produto, DetalheProduto, 
    Tamanho, TamanhoProduto, Pedido, ItemPedido, ImagemProduto, ImagemCategoria,
)

from .forms import ContatoLojaAdminForm, GerarEtiquetaMelhorEnvioForm

## INLINES ##

class ContatoLojaAdminInline(admin.StackedInline):
    model = ContatoLoja
    form = ContatoLojaAdminForm
    can_delete = False
    min_num = 1
    max_num = 1

class EnderecoAdminInline(admin.StackedInline):
    model = Endereco
    can_delete = False
    min_num = 1
    max_num = 1

class ImagemProdutoInline(admin.TabularInline):
    model = ImagemProduto
    extra = 1
    readonly_fields = ('preview_da_imagem_inline',)

    @admin.display(description='Preview')
    def preview_da_imagem_inline(self, obj):
        if obj.imagem and hasattr(obj.imagem, 'url'):
            return format_html('<img src="{0}" width="auto" height="100px" />', obj.imagem.url)
        return "Nenhuma imagem"

class ImagemCategoriaInline(admin.TabularInline):
    model = ImagemCategoria
    extra = 1
    readonly_fields = ('preview_da_imagem_inline',)

    @admin.display(description='Preview')
    def preview_da_imagem_inline(self, obj):
        if obj.imagem and hasattr(obj.imagem, 'url'):
            return format_html('<img src="{0}" width="auto" height="100px" />', obj.imagem.url)
        return "Nenhuma imagem"

class DetalheProdutoInline(admin.TabularInline):
    model = DetalheProduto
    extra = 1

class TamanhoProdutoInline(admin.TabularInline):
    model = TamanhoProduto
    autocomplete_fields = ('tamanho',)
    extra = 1

class ItemPedidoInline(admin.TabularInline):
    model = ItemPedido
    verbose_name_plural = 'Itens do Pedido'
    
    readonly_fields = ('link_para_produto', 'tamanho', 'quantidade', 'preco_unitario_congelado', 'subtotal')
    fields = ('link_para_produto', 'tamanho', 'quantidade', 'preco_unitario_congelado', 'subtotal')

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
    
    @admin.display(description='Produto')
    def link_para_produto(self, instance):
        url = reverse("admin:core_produto_change", args=[instance.produto.pk])
        return mark_safe(f'<a href="{url}">{instance.produto.nome}</a>')

## ADMIN MODELS ##

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

@admin.register(ContatoNormal)
class ContatoNormais(admin.ModelAdmin):
    list_display = ('get_nome_completo', 'cpf', 'email', 'whatsapp',)
    search_fields = ('nome', 'sobrenome', 'cpf', 'email', 'id', 'whatsapp',)
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

@admin.register(ContatoDeLoja)
class ContatoDeLojas(admin.ModelAdmin):
    list_display = ('get_nome_completo', 'get_instagram', 'email', 'whatsapp',)
    search_fields = ('nome', 'sobrenome', 'cpf', 'email', 'whatsapp', 'contatoloja__instagram', 'id',)
    list_display_links = ('get_nome_completo', 'get_instagram', 'email',)
    
    def get_queryset(self, request):
        return super().get_queryset(request).filter(contatoloja__isnull=False)
    
    @admin.display(description='Nome da Loja')
    def get_nome_completo(self, obj):
        return f'{obj.nome} {obj.sobrenome}'
    
    @admin.display(description='Instagram')
    def get_instagram(self, obj):
        return obj.contatoloja.instagram

    class Media:
        js = (
            'core/js/contato_masks.js', 
        )

@admin.register(InformacoesEntrega)
class InformacoesEntregas(admin.ModelAdmin):
    list_display = ('rastreador', 'transportadora', 'preco_frete', 'data_hora_finalizado',)
    readonly_fields = ('data_hora_finalizado',)
    list_display_links = ('rastreador', 'transportadora', 'preco_frete', 'data_hora_finalizado',)
    list_per_page = 20

    def has_add_permission(self, request):
        return False

@admin.register(Loja)
class Lojas(admin.ModelAdmin):
    list_display = ('apelido', 'get_contato_email', 'get_endereco_principal')
    list_display_links = ('apelido',)
    search_fields = ('apelido', 'contatoloja__contato__nome', 'contatoloja__contato__email')
    inlines = [ContatoLojaAdminInline, EnderecoAdminInline]

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

@admin.register(Categoria)
class Categorias(admin.ModelAdmin):
    list_display = ('nome_categoria', 'preview_da_imagem_lista',)
    list_display_links = ('nome_categoria', 'preview_da_imagem_lista',)
    search_fields = ('id', 'nome_categoria', 'nome_plural')
    inlines = [ImagemCategoriaInline]

    @admin.display(description='Imagem Principal')
    def preview_da_imagem_lista(self, obj):
        imagem_produto = obj.imagens.first()
        if imagem_produto and imagem_produto.imagem:
            return format_html('<img src="{0}" width="auto" height="80px" />', imagem_produto.imagem.url)
        return "Sem Imagem"

@admin.register(Tamanho)
class Tamanhos(admin.ModelAdmin):
    list_display = ('nome', 'valor')
    list_display_links = ('nome', 'valor')
    search_fields = ('nome', 'valor')

@admin.register(Produto)
class Produtos(admin.ModelAdmin):
    list_display = ('nome', 'listar_categorias', 'preco', 'preview_da_imagem_lista')
    list_display_links = ('nome', 'preview_da_imagem_lista',)
    list_filter = ('categorias__nome_plural',)
    search_fields = ('id', 'nome', 'descricao', 'categorias__nome_categoria')
    list_per_page = 20
    exclude=('qtd_em_compra',)
    
    inlines = [DetalheProdutoInline, ImagemProdutoInline, TamanhoProdutoInline]

    @admin.display(description='Categorias')
    def listar_categorias(self, obj):
        return ", ".join([c.nome_categoria for c in obj.categorias.all()])

    @admin.display(description='Imagem Principal')
    def preview_da_imagem_lista(self, obj):
        imagem_produto = obj.imagens.first()
        if imagem_produto and imagem_produto.imagem:
            return format_html('<img src="{0}" width="auto" height="80px" />', imagem_produto.imagem.url)
        return "Sem Imagem"

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        queryset = queryset.prefetch_related('categorias', 'imagens')
        return queryset


@admin.action(description='Gerar Etiqueta (Melhor Envio)')
def gerar_etiqueta_melhor_envio(modeladmin, request, queryset):
    print("\n--- AÇÃO INICIADA ---")
    print(f"Método da Requisição: {request.method}")
    print(f"Dados do POST: {request.POST}")
    # --- MOMENTO 0: Pegar a primeira instância de Loja ---
    loja = Loja.objects.first()
    if not loja:
        modeladmin.message_user(request, "Nenhuma loja configurada no sistema.", 'error')
        return

    contato_loja = getattr(loja, 'contatoloja', None)
    contato = getattr(contato_loja, 'contato', None)
    endereco_loja = loja.endereco_set.first()

    documento_remetente = (contato_loja.cnpj if contato_loja and contato_loja.cnpj else (contato.cpf if contato else ""))

    REMETENTE = {
        "name": loja.apelido or "Rô Alves Jewellery",
        "phone": contato.whatsapp if contato else "",
        "email": contato.email if contato else "",
        "document": documento_remetente,
        "address": endereco_loja.logradouro if endereco_loja else "",
        "number": str(endereco_loja.numero) if endereco_loja and endereco_loja.numero else "",
        "district": endereco_loja.bairro if endereco_loja else "",
        "city": endereco_loja.cidade if endereco_loja else "",
        "state_abbr": endereco_loja.uf if endereco_loja else "",
        "country_id": "BR",
        "postal_code": endereco_loja.cep.replace('-', '') if endereco_loja else "",
        "complement": endereco_loja.complemento if endereco_loja and endereco_loja.complemento else "",
    }
    
    # --- MOMENTO 2: Processar o formulário preenchido ---
    if 'confirmar_geracao' in request.POST:
        base_url = settings.MELHOR_ENVIO_BASE_URL
        print("--- ETAPA 2 DETECTADA: Tentando processar o formulário de dimensões. ---")
        form = GerarEtiquetaMelhorEnvioForm(request.POST)
        if form.is_valid():
            print("--- SUCESSO: Formulário é válido. Iniciando lógica da API. ---")
            peso = form.cleaned_data['peso']
            comprimento = form.cleaned_data['comprimento']
            largura = form.cleaned_data['largura']
            altura = form.cleaned_data['altura']
            
            pedido_ids_str = form.cleaned_data['selected_ids']
            pedido_ids = pedido_ids_str.split(',')
            pedidos_selecionados = modeladmin.get_queryset(request).filter(pk__in=pedido_ids)
            
            headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {settings.MELHOR_ENVIO_TOKEN}',
                'User-Agent': f'{settings.MELHOR_ENVIO_NAME} ({settings.MELHOR_ENVIO_EMAIL})'
            }
            
            mapa_ordem_pedido = {}

            for pedido in pedidos_selecionados:
                valor_declarado = sum(item.preco_unitario_congelado * item.quantidade for item in pedido.itens.all())
                
                service_id = pedido.info_entrega.servico_id
                if not service_id:
                    modeladmin.message_user(request, f"O Pedido #{pedido.id} não possui um ID de serviço de frete definido.", 'error')
                    continue

                payload_carrinho = {
                    "service": service_id,
                    "from": REMETENTE,
                    "to": {
                        "name": f"{pedido.contato_cliente.nome} {pedido.contato_cliente.sobrenome}",
                        "phone": pedido.contato_cliente.whatsapp.replace('(', '').replace(')', '').replace('-', '').replace(' ', ''),
                        "email": pedido.contato_cliente.email,
                        "document": pedido.contato_cliente.cpf,
                        "address": pedido.endereco_entrega.logradouro,
                        "number": str(pedido.endereco_entrega.numero),
                        "complement": pedido.endereco_entrega.complemento,
                        "district": pedido.endereco_entrega.bairro,
                        "city": pedido.endereco_entrega.cidade,
                        "state_abbr": pedido.endereco_entrega.uf,
                        "country_id": "BR",
                        "postal_code": pedido.endereco_entrega.cep.replace('-', ''),
                    },
                    "products": [
                        {"name": item.produto.nome, "quantity": item.quantidade, "unitary_value": float(item.preco_unitario_congelado)}
                        for item in pedido.itens.all()
                    ],
                    "volumes": [{"height": float(altura), "width": float(largura), "length": float(comprimento), "weight": float(peso)}],
                    "options": {
                        "insurance_value": float(valor_declarado),
                        "receipt": False,
                        "own_hand": False,
                        "non_commercial": True, # IMPORTANTE: Mude para False se for enviar com Nota Fiscal
                        # "invoice": { "key": "SUA_CHAVE_DE_NF_AQUI" } # Descomente e adicione a chave se non_commercial=False
                    }
                }
                
                try:
                    response_cart = requests.post(f"{base_url}/api/v2/me/cart", headers=headers, data=json.dumps(payload_carrinho))
                    response_cart.raise_for_status()
                    ordem_id = response_cart.json()['id']
                    mapa_ordem_pedido[ordem_id] = pedido # Mapeia o ID da ME para o nosso pedido
                except requests.exceptions.RequestException as e:
                    modeladmin.message_user(request, f"Erro na API (carrinho) para o Pedido #{pedido.id}: {e.response.text}", 'error')

            ordens_para_checkout = list(mapa_ordem_pedido.keys())
            if ordens_para_checkout:
                try:
                    # Comprar, Gerar e Imprimir
                    requests.post(f"{base_url}/api/v2/me/shipment/checkout", headers=headers, json={"orders": ordens_para_checkout}).raise_for_status()
                    requests.post(f"{base_url}/api/v2/me/shipment/generate", headers=headers, json={"orders": ordens_para_checkout}).raise_for_status()
                    response_print = requests.post(f"{base_url}/api/v2/me/shipment/print", headers=headers, json={"mode": "private", "orders": ordens_para_checkout})
                    response_print.raise_for_status()
                    url_etiqueta = response_print.json()['url']
                    
                    # Atualizar os pedidos no banco de dados
                    ordens_info = requests.get(f"{base_url}/api/v2/me/orders/{','.join(ordens_para_checkout)}", headers=headers).json()
                    for ordem_id, info in ordens_info.items():
                        if 'tracking' in info and info['tracking']:
                            pedido_a_atualizar = mapa_ordem_pedido[ordem_id]
                            pedido_a_atualizar.info_entrega.rastreador = info['tracking']
                            pedido_a_atualizar.info_entrega.save()
                            pedido_a_atualizar.status = 'S'
                            pedido_a_atualizar.save()
                    print("--- LÓGICA DA API FINALIZADA (simulação). Redirecionando... ---")
                    modeladmin.message_user(request, mark_safe(f"Etiquetas geradas com sucesso. <a href='{url_etiqueta}' target='_blank'>Clique aqui para imprimir</a>."), 'success')

                except requests.exceptions.RequestException as e:
                    modeladmin.message_user(request, f"Erro na API (checkout/impressão): {e.response.text}", 'error')
            return
        else:
            print("--- ERRO: Formulário é inválido! ---")
            print(form.errors.as_json())
            # Se o formulário for inválido, vamos mostrar os erros no admin
            modeladmin.message_user(request, f"Erro de validação no formulário: {form.errors.as_json()}", 'error')
            return
        

    print("--- ETAPA 1 DETECTADA: Exibindo o formulário de dimensões. ---")
    pks_list = list(queryset.values_list('pk', flat=True))
    pks_string = ','.join(str(pk) for pk in pks_list)
    
    form = GerarEtiquetaMelhorEnvioForm(initial={
        'selected_ids': pks_string
    })

    context = {
        'title': 'Informar Dimensões do Pacote (Melhor Envio)',
        'queryset': queryset,
        'form': form,
        'opts': modeladmin.model._meta,
        'action_name': 'gerar_etiqueta_melhor_envio',
    }

    return TemplateResponse(request, "admin/gerar_etiqueta_melhor_envio_form.html", context)

gerar_etiqueta_melhor_envio.short_description = 'Gerar Etiqueta (Melhor Envio)'

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
    actions = [gerar_etiqueta_melhor_envio]

    def has_add_permission(self, request):
        return False

    @admin.display(description='Valor Total', ordering='id')
    def valor_total_do_pedido(self, obj):
        total_produtos = 0
        for item in obj.itens.all():
            total_produtos += item.quantidade * item.preco_unitario_congelado
        preco_frete = 0
        if obj.info_entrega and obj.info_entrega.preco_frete:
            preco_frete = obj.info_entrega.preco_frete
        valor_final = total_produtos + preco_frete
        return f"R$ {valor_final:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")

