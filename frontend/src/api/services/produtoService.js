import apiClient from '../api';

/**
 * Busca a lista resumida de produtos. Pode ser filtrada por categoria.
 * @param {object} [filters={}] - Objeto de filtros.
 * @param {string|null} [filters.categoriaId=null] - O ID da categoria para filtrar os produtos.
 * @returns {Promise<object>} A resposta da API contendo a lista de produtos.
 * @example
 * // Exemplo de response.data para getProdutos():
 * [
 * {
 * "id": "uuid-do-produto-1",
 * "nome": "Anel Solitário de Prata",
 * "preco": "250.00",
 * "categorias": [ { "id": "uuid-da-categoria-1", "nome_categoria": "Anel" } ],
 * "primeira_imagem": "http://127.0.0.1:8000/media/images/anel_solitario.webp"
 * }
 * ]
 */
export const getProdutos = ({ categoriaId = null } = {}) => {
  let url = '/produtos/';
  if (categoriaId) {
    // A API espera o filtro no formato `?categorias__id=`
    url += `?categorias__id=${categoriaId}`;
  }
  return apiClient.get(url);
};

/**
 * Busca os detalhes completos de um produto específico pelo seu ID.
 * @param {string} id - O ID (UUID) do produto.
 * @returns {Promise<object>} A resposta da API contendo os dados detalhados do produto.
 * @example
 * // Exemplo de response.data:
 * {
 * "id": "uuid-do-produto-1",
 * "nome": "Anel Solitário de Prata",
 * "descricao": "Um anel elegante feito em prata 925 com uma zircônia central.",
 * "preco": "250.00",
 * // ... e todos os outros campos detalhados (imagens, detalhes, tamanhos, etc.)
 * }
 */
export const getProdutoById = (id) => {
  return apiClient.get(`/produtos/${id}/`);
};