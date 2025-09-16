# Views v6.4.0

from rest_framework import viewsets, mixins, status
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import Loja, Categoria, Produto, Pedido
from .serializers import (
    LojaPublicSerializer,
    CategoriaListSerializer,
    ProdutoListSerializer,
    ProdutoDetailSerializer,
    FreteQuoteSerializer,
    PedidoCreateSerializer,
    PedidoReadOnlySerializer,
)

from .permissions import HasAPIKey

#======================================================================
# ViewSets para Recursos Padrão
#======================================================================

class LojaViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet para listar e visualizar lojas.
    - GET /api/lojas/
    - GET /api/lojas/{id}/
    """
    queryset = Loja.objects.prefetch_related('endereco_set').select_related('contatoloja__contato').all()
    serializer_class = LojaPublicSerializer
    permission_classes = [HasAPIKey]
    lookup_field = 'id'

class CategoriaViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet para listar e visualizar categorias.
    - GET /api/categorias/
    - GET /api/categorias/{id}/
    """
    queryset = Categoria.objects.select_related('loja').prefetch_related('imagens').all()
    serializer_class = CategoriaListSerializer
    permission_classes = [HasAPIKey]
    lookup_field = 'id'

class ProdutoViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet para listar e visualizar produtos.
    - GET /api/produtos/
    - GET /api/produtos/{id}/
    """
    queryset = Produto.objects.prefetch_related(
        'categorias', 'imagens', 'detalheproduto_set', 'tamanhoproduto_set__tamanho'
    ).all()
    permission_classes = [HasAPIKey]
    lookup_field = 'id'

    def get_serializer_class(self):
        # Usa o serializer de detalhe se for uma requisição para um único objeto
        if self.action == 'retrieve':
            return ProdutoDetailSerializer
        # Caso contrário, usa o serializer de lista
        return ProdutoListSerializer

#======================================================================
# Views Manuais para Endpoints Customizados (CONTINUAM IGUAIS)
#======================================================================

class CotarFreteView(generics.GenericAPIView):
    """ View para receber um CEP e ID do produto e retornar as opções de frete. """
    serializer_class = FreteQuoteSerializer
    permission_classes = [HasAPIKey]
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data, status=status.HTTP_200_OK)

class PedidoCreateView(generics.CreateAPIView):
    """ View para criar um novo pedido. """
    serializer_class = PedidoCreateSerializer
    permission_classes = [HasAPIKey]
    queryset = Pedido.objects.none()
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        pedido_criado = serializer.save()
        read_serializer = PedidoReadOnlySerializer(pedido_criado)
        headers = self.get_success_headers(read_serializer.data)
        return Response(read_serializer.data, status=status.HTTP_201_CREATED, headers=headers)