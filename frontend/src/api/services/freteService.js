import apiClient from '../api';

/**
 * Calcula as opções de frete para um produto e CEP de destino.
 * @param {object} data - Objeto com os dados para a cotação.
 * @param {string} data.produtoId - O ID (UUID) do produto.
 * @param {string} data.cepDestino - O CEP de destino (ex: "01311-000").
 * @returns {Promise<object>} A resposta da API com a lista de opções de frete da Melhor Envio.
 * @example
 * // Exemplo de request payload:
 * {
 * "produto_id": "uuid-do-produto-1",
 * "cep_destino": "01311-000"
 * }
 * * // Exemplo de response.data:
 * [
 * {
 * "id": 1,
 * "name": "PAC",
 * "price": "21.50",
 * "delivery_time": 8,
 * "company": { "id": 1, "name": "Correios", "picture": "..." }
 * }
 * ]
 */
export const cotarFrete = ({ produtoId, cepDestino }) => {
  const payload = {
    produto_id: produtoId,
    cep_destino: cepDestino,
  };
  return apiClient.post('/cotar-frete/', payload);
};