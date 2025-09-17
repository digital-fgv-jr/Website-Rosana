# Views v8.0.0

from rest_framework import viewsets, generics, status
from rest_framework.response import Response

from rest_framework.decorators import action
from django.db.models import Count, Q

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
    - GET /api/categorias/top/{n}/
    """
    queryset = Categoria.objects.select_related('loja').prefetch_related('imagens').all()
    serializer_class = CategoriaListSerializer
    permission_classes = [HasAPIKey]
    lookup_field = 'id'

    @action(detail=False, methods=['get'], url_path='top/(?P<n>[0-9]+)')
    def top(self, request, n=None):
        """
        Retorna as 'n' categorias com mais produtos, ordenadas pela contagem de produtos.
        """
        try:
            # Converte o parâmetro 'n' da URL para um inteiro
            limit = int(n)
        except (ValueError, TypeError):
            return Response(
                {"error": "O parâmetro 'n' deve ser um número inteiro válido."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Anota cada categoria com a contagem de produtos associados
        # e ordena de forma decrescente por essa contagem
        queryset = Categoria.objects.annotate(
            product_count=Count('produto')
        ).order_by('-product_count')[:limit]
        
        # Serializa os dados e retorna a resposta
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class ProdutoViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet para listar e visualizar produtos.
    - GET /api/produtos/
    - GET /api/produtos/{id}/
    - GET /api/produtos/{id}/relacionados
    """
    queryset = Produto.objects.prefetch_related(
        'categorias', 'imagens', 'detalheproduto_set', 'tamanhoproduto_set__tamanho'
    ).all()
    permission_classes = [HasAPIKey]
    lookup_field = 'id'

    def get_queryset(self):
        queryset = Produto.objects.prefetch_related(
            'categorias', 'imagens', 'detalheproduto_set', 'tamanhoproduto_set__tamanho'
        ).all()

        # Handle search query parameter 'q'
        search_query = self.request.query_params.get('q', None)
        if search_query:
            queryset = queryset.filter(
                Q(nome__icontains=search_query) |
                Q(descricao__icontains=search_query) |
                Q(categorias__nome_categoria__icontains=search_query) |
                Q(categorias__nome_plural__icontains=search_query)
            ).distinct()

        # Handle category filtering
        category_id = self.request.query_params.get('categorias__id', None)
        if category_id:
            queryset = queryset.filter(categorias__id=category_id)

        return queryset

    def get_serializer_class(self):
        # Usa o serializer de detalhe se for uma requisição para um único objeto
        if self.action == 'retrieve':
            return ProdutoDetailSerializer
        # Caso contrário, usa o serializer de lista
        return ProdutoListSerializer

    @action(detail=True, methods=['get'], url_path='relacionados')
    def relacionados(self, request, id=None):
        """
        Retorna uma lista de até 7 produtos relacionados baseados na(s) categoria(s) do produto principal.
        A prioridade é:
        1. Produtos com nome similar na mesma categoria.
        2. Outros produtos na mesma categoria.
        """"""
        Retorna uma lista de até 7 produtos relacionados.
        A prioridade é:
        1. Produtos da(s) mesma(s) categoria(s).
        2. (Fallback) Outros produtos de quaisquer categorias para completar a lista.
        """
        try:
            produto_principal = self.get_object()
        except Produto.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        categorias_ids = produto_principal.categorias.values_list('id', flat=True)
        
        produtos_relacionados = []
        ids_ja_incluidos = {produto_principal.id}

        # 1. Tenta buscar até 7 produtos da(s) mesma(s) categoria(s)
        if list(categorias_ids):
            produtos_da_mesma_categoria = Produto.objects.filter(
                categorias__id__in=categorias_ids
            ).exclude(id=produto_principal.id).distinct().order_by('?')[:7]
            
            for p in produtos_da_mesma_categoria:
                produtos_relacionados.append(p)
                ids_ja_incluidos.add(p.id)

        # 2. Fallback: completa a lista com outros produtos aleatórios se necessário
        necessarios = 7 - len(produtos_relacionados)
        if necessarios > 0:
            produtos_fallback = Produto.objects.exclude(
                id__in=ids_ja_incluidos
            ).order_by('?')[:necessarios]
            
            produtos_relacionados.extend(produtos_fallback)

        # Usa o serializer de lista, que é o correto para este tipo de resposta
        serializer = ProdutoListSerializer(produtos_relacionados, many=True, context={'request': request})
        return Response(serializer.data)

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