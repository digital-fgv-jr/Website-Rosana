import apiClient from '../api';

/**
 * Busca a lista de todas as lojas disponíveis.
 * @returns {Promise<AxiosResponse<Array<object>>>} Uma Promessa que resolve para a resposta da API contendo a lista de lojas.
 * @example
 * // Exemplo de como a resposta (`response.data`) será estruturada:
 * [
 * {
 * "id": "uuid-da-loja-1",
 * "apelido": "Joalheria Central",
 * "endereco": [
 * {
 * "id": "uuid-do-endereco-1",
 * "cep": "22231-020",
 * "logradouro": "Rua Principal",
 * "numero": 100,
 * "complemento": null,
 * "bairro": "Centro",
 * "cidade": "Rio de Janeiro",
 * "uf": "RJ"
 * }
 * ],
 * "contatoloja": {
 * "contato": {
 * "id": "uuid-do-contato-1",
 * "nome": "Carlos",
 * "sobrenome": "Ribeiro",
 * "cpf": "11122233344",
 * "email": "contato@joalheriacentral.com"
 * },
 * "whatsapp": "(21) 99999-8888",
 * "telefone": "(21) 2222-3333",
 * "instagram": "@joalheriacentral",
 * "cnpj": "11.222.333/0001-44"
 * }
 * }
 * ]
 */
export const getLojas = () => {
  // GET /api/lojas/
  return apiClient.get('/lojas/');
};

/**
 * Busca os detalhes de uma loja específica pelo seu ID.
 * Nota: Para buscar o catálogo de produtos da loja, use a função getCategoriasByIdLoja.
 * @param {string} id - O ID (UUID) da loja.
 * @returns {Promise<AxiosResponse<object>>} Uma Promessa que resolve para a resposta da API com os detalhes da loja.
 * @example
 * // A resposta (`response.data`) terá a mesma estrutura de um objeto da lista acima.
 */
export const getLojaById = id => {
  // GET /api/lojas/{id}/
  return apiClient.get(`/lojas/${id}/`);
};