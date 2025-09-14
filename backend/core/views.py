# Views v4.4.2

from rest_framework import viewsets, mixins, status
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from .permissions import HasAPIKey


from django.conf import settings
from django.db import transaction
import mercadopago

from .models import Loja, Categoria, Produto, Pedido, InformacoesEntrega
from .serializers import (
    LojaInfoSerializer,
    ListaCategoriasLoja,
    ListaProdutosCategoria,
    ProdutoSerializer,
    FreteSerializer,
    PedidoSerializer,
    ListaContatosNormaisSerializer,
    ListaContatosLojaSerializer,
    ContatoNormal,
    ContatoDeLoja
)

# --- Views do Catálogo (principalmente leitura) ---

class LojaViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Endpoint para visualizar lojas e seus catálogos.
    - GET /lojas/
    - GET /lojas/{id}/
    - GET /lojas/{id}/categorias/
    """
    queryset = Loja.objects.prefetch_related(
        'endereco_set', 'contatoloja__contato', 'categoria_set__produto_set'
    )
    serializer_class = LojaInfoSerializer
    permission_classes = [HasAPIKey]

    @action(detail=True, methods=['get'])
    def categorias(self, request, pk=None):
        """Endpoint customizado para listar apenas as categorias de uma loja específica."""
        loja = self.get_object()
        serializer = ListaCategoriasLoja(loja, context={'request': request})
        return Response(serializer.data)

class CategoriaViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Endpoint para visualizar uma categoria e seus produtos.
    - GET /categorias/{id}/
    """
    queryset = Categoria.objects.all()
    serializer_class = ListaProdutosCategoria
    permission_classes = [HasAPIKey]

class ProdutoViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Endpoint para visualizar produtos.
    - GET /produtos/
    - GET /produtos/{id}/
    """
    queryset = Produto.objects.all().prefetch_related('categorias')
    serializer_class = ProdutoSerializer
    permission_classes = [HasAPIKey]

# --- Views de Contato (leitura) ---

class ContatoNormalViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Endpoint para listar contatos de clientes.
    - GET /contatos-clientes/
    """
    queryset = ContatoNormal.objects.filter(contatoloja__isnull=True)
    serializer_class = ListaContatosNormaisSerializer
    permission_classes = [HasAPIKey] # Mude para IsAdminUser em produção

class ContatoDeLojaViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Endpoint para listar contatos de lojas.
    - GET /contatos-lojas/
    """
    queryset = ContatoDeLoja.objects.filter(contatoloja__isnull=False)
    serializer_class = ListaContatosLojaSerializer
    permission_classes = [HasAPIKey] # Mude para IsAdminUser em produção

# --- Views do Fluxo de Compra ---

class FreteAPIView(APIView):
    """
    Endpoint para cotação de frete.
    - POST /cotar-frete/
    """
    permission_classes = [HasAPIKey]

    def post(self, request, *args, **kwargs):
        serializer = FreteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data)

class PedidoViewSet(mixins.CreateModelMixin,
                    mixins.RetrieveModelMixin,
                    mixins.ListModelMixin,
                    viewsets.GenericViewSet):
    """
    ViewSet para criar e visualizar pedidos.
    - POST /pedidos/ -> Cria um novo pedido (checkout).
    - GET /pedidos/ -> Lista os pedidos.
    - GET /pedidos/{id}/ -> Detalhes de um pedido.
    """
    queryset = Pedido.objects.all().order_by('-data_hora_criacao')
    serializer_class = PedidoSerializer
    permission_classes = [HasAPIKey]

class MercadoPagoWebhookView(APIView):
    """
    Recebe e processa webhooks do Mercado Pago, atualizando o status do pedido
    e realizando o estorno de estoque em caso de falha no pagamento.
    """
    # Webhooks não devem exigir a API Key do cliente; validar assinatura no futuro
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        notification_id = request.data.get('data', {}).get('id')
        topic = request.data.get('type')

        if not notification_id or topic != 'payment':
            return Response(status=status.HTTP_200_OK)

        try:
            sdk = mercadopago.SDK(settings.MERCADOPAGO_ACCESS_TOKEN)
            payment_info = sdk.payment().get(notification_id)["response"]
            pedido_id = payment_info.get("external_reference")
            
            if not pedido_id:
                return Response(status=status.HTTP_400_BAD_REQUEST)

            pedido = Pedido.objects.select_related('info_entrega').prefetch_related('itens__produto').get(id=pedido_id)
            payment_status = payment_info.get("status")

            # --- LÓGICA DE ATUALIZAÇÃO DE STATUS E ESTOQUE ---

            if payment_status == "approved" and pedido.status == 'A':
                # Pagamento APROVADO: Muda o status para "Em Preparo".
                # O estoque já foi abatido na criação do pedido, então não fazemos nada.
                pedido.status = 'E'
                pedido.save()

            elif payment_status in ["rejected", "cancelled"] and pedido.status == 'A':
                # Pagamento RECUSADO ou CANCELADO: Estorna o estoque.
                with transaction.atomic():
                    
                    for item in pedido.itens.all():
                        produto = item.produto
                        produto.qtd_disponivel += item.quantidade
                        produto.save()

                    pedido.status = 'R'
                    pedido.save()

        except Pedido.DoesNotExist:
            print(f"Webhook do MP recebido para pedido não encontrado: {pedido_id}")
        except Exception as e:
            print(f"Erro ao processar webhook do Mercado Pago: {e}")
        
        return Response(status=status.HTTP_200_OK)

class FrenetWebhookView(APIView):
    """
    Recebe e processa notificações de webhook da Frenet.
    Atualiza o status do pedido com base no status de rastreamento da entrega.
    """
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        data = request.data

        tracking_code = data.get('TrackingNumber')
        frenet_status = data.get('ShippingOrderStatusDescription')

        if not tracking_code or not frenet_status:
            return Response({"error": "Dados inválidos"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            info_entrega = InformacoesEntrega.objects.select_related('pedido').get(rastreador=tracking_code)
            
            pedido = info_entrega.pedido

            if frenet_status in ["Objeto postado", "Em trânsito"]:
                pedido.status = 'S'
            elif frenet_status == "Objeto entregue ao destinatário":
                pedido.status = 'C'
            
            if pedido.status == 'C' and not info_entrega.data_hora_finalizado:
                from django.utils import timezone
                info_entrega.data_hora_finalizado = timezone.now()
                info_entrega.save()

            pedido.save()

        except InformacoesEntrega.DoesNotExist:
            print(f"Webhook da Frenet recebido para rastreador não encontrado: {tracking_code}")
        except Exception as e:
            print(f"Erro ao processar webhook da Frenet: {e}")

        return Response(status=status.HTTP_200_OK)
