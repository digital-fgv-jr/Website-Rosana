import apiClient from '../api';

/**
 * Cria um novo pedido no sistema e gera um link de pagamento.
 * @param {object} pedidoData - O objeto completo contendo todos os dados do pedido.
 * @returns {Promise<object>} A resposta da API com os dados do pedido criado e a URL de pagamento.
 * @example
 * // Exemplo de request payload (pedidoData):
 * {
 * "contato_cliente": {
 * "nome": "Ana", "sobrenome": "Silva", "cpf": "11122233344",
 * "email": "ana.silva@email.com", "whatsapp": "11987654321"
 * },
 * "endereco_entrega": {
 * "cep": "01311-000", "logradouro": "Avenida Paulista", "numero": 1500,
 * "complemento": "Apto 505", "bairro": "Bela Vista", "cidade": "São Paulo", "uf": "SP"
 * },
 * "itens": [ { "tamanho_id": "uuid-do-tamanho-produto", "quantidade": 1 } ],
 * "frete_escolhido": {
 * "transportadora": "PAC", "servico_id": 1,
 * "preco_frete": "21.50", "entrega_estimada_dias": 8
 * }
 * }
 * * // Exemplo de response.data:
 * {
 * "id": "novo-uuid-do-pedido",
 * "status": "Aguardando Pagamento",
 * "url_pagamento": "https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=...",
 * "data_hora_criacao": "2025-09-15T..."
 * }
 */
export const criarPedido = (pedidoData) => {
  return apiClient.post('/pedidos/', pedidoData);
};