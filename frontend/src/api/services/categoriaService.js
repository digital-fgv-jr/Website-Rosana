import apiClient from '../api';

/**
 * Busca a lista de todas as categorias de produtos.
 * @returns {Promise<object>} A resposta da API contendo a lista de categorias.
 */
export const getCategorias = () => {
  return apiClient.get('/categorias/');
};

/**
 * Busca os detalhes de uma categoria específica pelo seu ID.
 * @param {string} id - O ID (UUID) da categoria.
 * @returns {Promise<object>} A resposta da API contendo os dados da categoria.
 */
export const getCategoriaById = (id) => {
  return apiClient.get(`/categorias/${id}/`);
};

/**
 * Busca as 'n' categorias com mais produtos.
 * @param {number} n - O número de categorias a serem retornadas.
 * @returns {Promise<object>} A resposta da API contendo a lista das top categorias.
 * @example
 * // Exemplo de response.data para getTopCategorias(5):
 * [
 * {
 * "id": "uuid-da-categoria-1",
 * "nome_categoria": "Anel",
 * "nome_plural": "Anéis",
 * "primeira_imagem": "http://127.0.0.1:8000/media/images/imagem_anel.webp"
 * },
 * // ... (outras 4 categorias)
 * ]
 */
export const getTopCategorias = (n) => {
  return apiClient.get(`/categorias/top/${n}/`);
};