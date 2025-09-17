// file: frontend/src/api/services/freteService.js
import apiClient from '../api';

/**
 * Calcula as opções de frete para um conjunto de itens e um CEP de destino.
 * @param {string} cepDestino - O CEP de destino (ex: "01311-000").
 * @param {Array<object>} itens - Uma lista de itens no carrinho.
 * @param {string} itens[].tamanho_id - O ID do TamanhoProduto do item.
 * @param {number} itens[].quantidade - A quantidade do item.
 * @returns {Promise<object>} A resposta da API com a lista de opções de frete.
 * @example
 * // Exemplo de payload:
 * const cep = "22220-001";
 * const carrinho = [
 * { tamanho_id: "uuid-tamanho-produto-1", quantidade: 1 },
 * { tamanho_id: "uuid-tamanho-produto-2", quantidade: 2 }
 * ];
 * cotarFrete(cep, carrinho);
 *
 * // Exemplo de response.data:
 * [
 * {
 * "id": 1,
 * "name": "PAC",
 * "price": "28.70",
 * "delivery_time": 9,
 * // ...
 * }
 * ]
 */
export const cotarFrete = (cepDestino, itens) => {
  const payload = {
    cep_destino: cepDestino,
    itens: itens,
  };
  return apiClient.post('/cotar-frete/', payload);
};