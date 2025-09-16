import apiClient from '../api';

/**
 * Busca a lista de todas as categorias de produtos.
 * @returns {Promise<object>} A resposta da API contendo a lista de categorias.
 * @example
 * // Exemplo de response.data:
 * [
 * {
 * "id": "f4g5h6j7-k8l9-1011-1213-141516abcdef",
 * "nome_categoria": "Anel",
 * "nome_plural": "Anéis",
 * "loja": {
 * "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
 * "apelido": "Rô Alves Jewellery"
 * },
 * "primeira_imagem": "http://127.0.0.1:8000/media/images/exemplo_anel.webp"
 * }
 * ]
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