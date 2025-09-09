# CoreUrls v4.0.0

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'lojas', views.LojaViewSet, basename='loja')
router.register(r'categorias', views.CategoriaViewSet, basename='categoria')
router.register(r'produtos', views.ProdutoViewSet, basename='produto')
router.register(r'pedidos', views.PedidoViewSet, basename='pedido')
router.register(r'contatos-clientes', views.ContatoNormalViewSet, basename='contato-cliente')
router.register(r'contatos-lojas', views.ContatoDeLojaViewSet, basename='contato-loja')

urlpatterns = [
    # Rotas geradas automaticamente para os ViewSets
    path('', include(router.urls)),
    
    # Rota manual para a nossa APIView de cotação de frete
    path('cotar-frete/', views.FreteAPIView.as_view(), name='cotar-frete'),

    # Rotas para os webhooks
    path('webhook/mercado-pago/notificacoes/', views.MercadoPagoWebhookView.as_view(), name='webhook-mercado-pago'),
    path('webhook/frenet/rastreamento/', views.FrenetWebhookView.as_view(), name='webhook-frenet'),

]