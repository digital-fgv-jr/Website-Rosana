import apiClient from '../api';

/**
 * Calcula o frete para uma lista de itens e um CEP de destino.
 * @param {string} cepDestino - O CEP do cliente (ex: "22231-020").
 * @param {Array<{tamanho_id: string, quantidade: number}>} itens - A lista de itens a serem cotados. O 'tamanho_id' deve ser o UUID do TamanhoProduto.
 * @returns {Promise<AxiosResponse<Array<object>>>} Uma Promessa que resolve para a resposta da API com as opções de frete.
 * * @example
 * // Exemplo de 'itens' a serem enviados:
 * const itensParaCotar = [
 * { tamanho_id: "a1b2c3d4-...", quantidade: 1 },
 * { tamanho_id: "e5f6g7h8-...", quantidade: 2 }
 * ];
 * * * @example
 * // Exemplo de como a resposta (`response.data`) será estruturada:
 * [
 * {
 * "transportadora": "SEDEX",
 * "codigo_servico": "03220",
 * "preco_frete": "28.50",
 * "prazo_entrega_dias": 8,
 * "data_entrega_estimada": "2025-09-20"
 * },
 * {
 * "transportadora": "PAC",
 * "codigo_servico": "03298",
 * "preco_frete": "19.90",
 * "prazo_entrega_dias": 12,
 * "data_entrega_estimada": "2025-09-24"
 * }
 * ]
 */
export const cotarFrete = (cepDestino, itens) => {
  const payload = {
    cep_destino: cepDestino,
    itens: itens,
  };
  // POST /api/cotar-frete/
  return apiClient.post('/cotar-frete/', payload);
};