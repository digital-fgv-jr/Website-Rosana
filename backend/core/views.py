# Views v2.1.0

from rest_framework import viewsets, mixins, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Loja, Categoria, Produto, Carrinho, Pedido
from .serializers import (
    LojaSerializer, ListaCategoriasLojaSerializer, ProdutoSerializer,
    ListaProdutosCategoriaSerializer, CarrinhoSerializer, #PedidoSerializer
)

class LojaViewSet(viewsets.ReadOnlyModelViewSet):
    """
    - GET /api/lojas/ -> Lista todas as lojas.
    - GET /api/lojas/{id}/ -> Detalhes de uma loja.
    - GET /api/lojas/{id}/categorias/ -> Lista de categorias (e produtos) da loja.
    """
    queryset = Loja.objects.all()
    serializer_class = LojaSerializer
    permission_classes = [permissions.AllowAny]

    @action(detail=True, methods=['get'])
    def categorias(self, request, pk=None):
        loja = self.get_object()
        queryset = Categoria.objects.filter(loja=loja)
        serializer = ListaCategoriasLojaSerializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)

class CategoriaViewSet(viewsets.ReadOnlyModelViewSet):
    """
    - GET /api/categorias/{id}/ -> Detalhes de uma categoria e sua lista de produtos.
    """
    queryset = Categoria.objects.all()
    serializer_class = ListaProdutosCategoriaSerializer
    permission_classes = [permissions.AllowAny]

class ProdutoViewSet(viewsets.ReadOnlyModelViewSet):
    """
    - GET /api/produtos/ -> Lista todos os produtos.
    - GET /api/produtos/{id}/ -> Detalhes de um produto.
    """
    queryset = Produto.objects.all()
    serializer_class = ProdutoSerializer
    permission_classes = [permissions.AllowAny]

class CarrinhoViewSet(mixins.CreateModelMixin,
                      mixins.RetrieveModelMixin,
                      mixins.UpdateModelMixin,
                      viewsets.GenericViewSet):
    """
    - POST /api/carrinhos/ -> Cria um novo carrinho.
    - GET /api/carrinhos/{id}/ -> Vê o conteúdo do carrinho.
    - PATCH /api/carrinhos/{id}/ -> Adiciona/atualiza/remove um item do carrinho.
    """
    queryset = Carrinho.objects.all()
    serializer_class = CarrinhoSerializer
    permission_classes = [permissions.AllowAny]

'''
class PedidoViewSet(mixins.CreateModelMixin,
                    mixins.RetrieveModelMixin,
                    mixins.ListModelMixin, # Adicionado para listar pedidos (opcional)
                    viewsets.GenericViewSet):
    """
    - POST /api/pedidos/ -> Cria um novo pedido a partir de um carrinho.
    - GET /api/pedidos/ -> Lista os pedidos.
    - GET /api/pedidos/{id}/ -> Detalhes de um pedido.
    """
    queryset = Pedido.objects.all()
    serializer_class = PedidoSerializer
    permission_classes = [permissions.AllowAny]

    def get_serializer_context(self):
        return {'request': self.request}
'''
