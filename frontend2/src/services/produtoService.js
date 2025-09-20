// file: frontend/src/api/services/produtoService.js
import apiClient from './api/apiClient';

/**
 * Busca a lista resumida de produtos. Pode ser filtrada por categoria e/ou termo de busca.
 * @param {object} [filters={}] - Objeto de filtros.
 * @param {string|null} [filters.categoriaId=null] - O ID da categoria para filtrar os produtos.
 * @param {string|null} [filters.q=null] - O termo de busca para filtrar os produtos.
 * @returns {Promise<object>} A resposta da API contendo a lista de produtos.
 */
export const getProdutos = ({ categoriaId = null, q = null } = {}) => {
  const params = new URLSearchParams();
  if (categoriaId) {
    params.append('categorias__id', categoriaId);
  }
  if (q) {
    params.append('q', q);
  }
  
  const queryString = params.toString();
  const url = `/produtos/${queryString ? `?${queryString}` : ''}`;
  
  return apiClient.get(url);
};

/**
 * Busca os detalhes completos de um produto específico pelo seu ID.
 * @param {string} id - O ID (UUID) do produto.
 * @returns {Promise<object>} A resposta da API contendo os dados detalhados do produto.
 */
export const getProdutoById = (id) => {
  return apiClient.get(`/produtos/${id}/`);
};

/**
 * Busca uma lista de produtos relacionados a um produto específico.
 * @param {string} id - O ID (UUID) do produto principal.
 * @returns {Promise<object>} A resposta da API contendo a lista de produtos relacionados.
 * @example
 * // Exemplo de response.data para getProdutosRelacionados('uuid-do-produto-1'):
 * [
 * {
 * "id": "uuid-do-produto-relacionado-1",
 * "nome": "Outro Anel de Prata",
 * "preco": "300.00",
 * "primeira_imagem": "http://127.0.0.1:8000/media/images/outro_anel.webp"
 * },
 * // ... (até 7 produtos)
 * ]
 */
export const getProdutosRelacionados = (id) => {
  return apiClient.get(`/produtos/${id}/relacionados/`);
};