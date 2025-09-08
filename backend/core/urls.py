# urls v1.1.0

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'lojas', views.LojaViewSet, basename='loja')
router.register(r'categorias', views.CategoriaViewSet, basename='categoria')
router.register(r'produtos', views.ProdutoViewSet, basename='produto')
router.register(r'carrinhos', views.CarrinhoViewSet, basename='carrinho')
#router.register(r'pedidos', views.PedidoViewSet, basename='pedido')

urlpatterns = [
    path('', include(router.urls)),
]