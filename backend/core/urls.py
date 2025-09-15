# CoreUrls v6.1.0

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    LojaViewSet,
    CategoriaViewSet,
    ProdutoViewSet,
    CotarFreteView,
    PedidoCreateView,
)

router = DefaultRouter()
router.register(r'lojas', LojaViewSet, basename='loja')
router.register(r'categorias', CategoriaViewSet, basename='categoria')
router.register(r'produtos', ProdutoViewSet, basename='produto')

urlpatterns = [
    path('', include(router.urls)),
    path('cotar-frete/', CotarFreteView.as_view(), name='cotar-frete'),
    path('pedidos/', PedidoCreateView.as_view(), name='pedido-create'),
]