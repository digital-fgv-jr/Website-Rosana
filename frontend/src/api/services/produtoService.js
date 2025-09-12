import apiClient from '../api';

/**
 * Busca a lista de todos os produtos disponíveis no catálogo.
 * @returns {Promise<AxiosResponse<Array<object>>>} Uma Promessa que resolve para a resposta da API contendo a lista de produtos.
 * @example
 * // Exemplo da estrutura de um objeto Produto na lista da resposta (`response.data`):
 * [
 * {
 * "id": "uuid-do-produto-aqui",
 * "nome": "Colar de Pérolas Clássico",
 * "descricao": "Um colar atemporal, perfeito para qualquer ocasião.",
 * "preco": "899.90",
 * "qtd_disponivel": 15,
 * "categoria": {
 * "id": "uuid-da-categoria",
 * "nome_categoria": "Colares"
 * },
 * "detalhes": [
 * {
 * "id": "uuid-do-detalhe",
 * "propriedade": "Material",
 * "descricao": "Pérolas de água doce e fecho em Prata 925"
 * }
 * ],
 * "imagens": [
 * {
 * "id": "uuid-da-imagemproduto",
 * "imagem": {
 * "id": "uuid-da-imagem",
 * "titulo": "Colar em destaque",
 * "imagem": "http://seu-site.com/media/images/colar_perolas.webp"
 * }
 * }
 * ],
 * "tamanhos": [
 * {
 * "id": "uuid-do-tamanhoproduto",
 * "tamanho": {
 * "id": "uuid-do-tamanho",
 * "nome": "Comprimento",
 * "valor": "45"
 * }
 * }
 * ],
 * "informacoes_transporte": {
 * "peso": "0.15",
 * "comprimento": "20.00",
 * "largura": "15.00",
 * "altura": "5.00",
 * "dias_para_disponibilizar": 2
 * },
 * "disponivel_para_compra": true
 * }
 * ]
 */
export const getProdutos = () => {
  // GET /api/produtos/
  return apiClient.get('/produtos/');
};

/**
 * Busca os detalhes completos de um produto específico pelo seu ID (UUID).
 * @param {string} id - O ID (UUID) do produto.
 * @returns {Promise<AxiosResponse<object>>} Uma Promessa que resolve para a resposta da API com os detalhes do produto.
 * @example
 * // A estrutura da resposta (`response.data`) é um único objeto
 * // idêntico ao do exemplo da função getProdutos.
 */
export const getProdutoById = id => {
  // GET /api/produtos/{id}/
  return apiClient.get(`/produtos/${id}/`);
};