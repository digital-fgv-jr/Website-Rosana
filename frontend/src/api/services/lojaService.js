import apiClient from '../api';

/**
 * Busca a lista de todas as lojas com suas informações públicas.
 * @returns {Promise<object>} A resposta da API contendo a lista de lojas.
 * @example
 * // Exemplo de response.data:
 * [
 * {
 * "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
 * "apelido": "Rô Alves Jewellery",
 * "contato_loja": {
 * "contato": {
 * "nome": "Rô Alves",
 * "sobrenome": "Jewellery",
 * "cpf": "123.456.789-00",
 * "email": "contato@jewellery.roalves.com.br",
 * "whatsapp": "(21) 99999-9999"
 * },
 * "instagram": "@roalves_jewellery",
 * "cnpj": "14.946.698/0001-47"
 * },
 * "enderecos": [
 * {
 * "cep": "22231-020",
 * "logradouro": "Rua Farani",
 * "numero": 3,
 * "complemento": "Apto 101",
 * "bairro": "Botafogo",
 * "cidade": "Rio de Janeiro",
 * "uf": "RJ"
 * }
 * ]
 * }
 * ]
 */
export const getLojas = () => {
  return apiClient.get('/lojas/');
};

/**
 * Busca os detalhes de uma loja específica pelo seu ID.
 * @param {string} id - O ID (UUID) da loja.
 * @returns {Promise<object>} A resposta da API contendo os dados da loja.
 */
export const getLojaById = (id) => {
  return apiClient.get(`/lojas/${id}/`);
};