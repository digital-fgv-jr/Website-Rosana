import apiClient from '../api';

/**
 * Busca o catálogo completo de uma loja, com todos os seus produtos agrupados por categoria.
 * Ideal para montar a página principal de uma loja.
 * @param {string} id - O ID (UUID) da loja que se deseja buscar.
 * @returns {Promise<AxiosResponse<Array<object>>>} Uma Promessa que resolve para a resposta da API.
 * * @example
 * // Exemplo de como a resposta (`response.data`) será estruturada:
 * [
 * {
 * "id": "uuid-da-categoria-1",
 * "nome_categoria": "Anéis de Ouro",
 * "produtos": [
 * {
 * "id": "uuid-do-produto-101",
 * "nome": "Anel Solitário de Diamante",
 * "descricao": "Um anel clássico para momentos especiais.",
 * "preco": "2500.00",
 * "qtd_disponivel": 5,
 * "categoria": { "id": "uuid-da-categoria-1", "nome_categoria": "Anéis de Ouro" },
 * "imagens": [ { "id": "...", "imagem": { "id": "...", "titulo": "...", "imagem": "url-completa-da-imagem.webp" } } ],
 * "tamanhos": [ { "id": "...", "tamanho": { "id": "...", "nome": "Aro", "valor": "18" } } ],
 * "informacoes_transporte": { "peso": "0.05", ..., "dias_para_disponibilizar": 3 },
 * "disponivel_para_compra": true
 * }
 * ]
 * },
 * {
 * "id": "uuid-da-categoria-2",
 * "nome_categoria": "Colares de Prata",
 * "produtos": [ ... ]
 * }
 * ]
 */
export const getCategoriasByIdLoja = id => {
  // A chamada de API real.
  // GET /api/lojas/{id}/categorias/
  return apiClient.get(`/lojas/${id}/categorias/`);
};


/**
 * Busca os detalhes de uma categoria específica, incluindo a lista completa de seus produtos.
 * Ideal para montar a página de uma categoria específica.
 * @param {string} id - O ID (UUID) da categoria que se deseja buscar.
 * @returns {Promise<AxiosResponse<object>>} Uma Promessa que resolve para a resposta da API.
 * * @example
 * // Exemplo de como a resposta (`response.data`) será estruturada:
 * {
 * "id": "uuid-da-categoria-1",
 * "nome_categoria": "Anéis de Ouro",
 * "produtos": [
 * {
 * "id": "uuid-do-produto-101",
 * "nome": "Anel Solitário de Diamante",
 * "preco": "2500.00",
 * ... (todos os outros detalhes do produto)
 * },
 * {
 * "id": "uuid-do-produto-102",
 * "nome": "Anel Trançado",
 * "preco": "1200.00",
 * ...
 * }
 * ]
 * }
 */
export const getCategoriaById = id => {
  // A chamada de API real.
  // GET /api/categorias/{id}/
  return apiClient.get(`/categorias/${id}/`);
};