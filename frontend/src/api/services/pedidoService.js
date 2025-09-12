import apiClient from '../api'; 

/**
 * Cria um novo pedido no sistema (finaliza a compra).
 * @param {object} dadosDoPedido - O payload completo para criar o pedido.
 * @returns {Promise<AxiosResponse<object>>} A promessa da chamada de API com os detalhes do pedido criado.
 * @example
 * // Exemplo do objeto 'dadosDoPedido' a ser enviado:
 * {
 * "itens": [
 * { "tamanho_id": "uuid-do-tamanhoproduto-1", "quantidade": 1 },
 * { "tamanho_id": "uuid-do-tamanhoproduto-2", "quantidade": 2 }
 * ],
 * "contato_cliente_data": {
 * "nome": "Bruno",
 * "sobrenome": "Silva",
 * "cpf": "11122233344",
 * "email": "bruno@email.com"
 * },
 * "endereco_entrega_data": {
 * "cep": "22231-020",
 * "logradouro": "Rua Nova",
 * "numero": 100,
 * "complemento": "Apto 202",
 * "bairro": "Bairro Novo",
 * "cidade": "Rio de Janeiro",
 * "uf": "RJ"
 * },
 * "frete_escolhido": {
 * "transportadora": "SEDEX",
 * "preco_frete": "28.50",
 * "prazo_entrega_dias": 8,
 * "data_entrega_estimada": "2025-09-20"
 * }
 * }
 */
export const criarPedido = (dadosDoPedido) => {
  // POST /api/pedidos/
  return apiClient.post('/pedidos/', dadosDoPedido);
};

/**
 * Busca os detalhes de um pedido específico pelo seu ID (UUID).
 * @param {string} pedidoId - O ID (UUID) do pedido.
 * @returns {Promise<AxiosResponse<object>>} A promessa da chamada de API com os detalhes do pedido.
 * @example
 * // Exemplo de como a resposta (`response.data`) será estruturada:
 * {
 * "id": "uuid-do-pedido-aqui",
 * "status": "Em Preparo",
 * "data_hora_criacao": "2025-09-12T03:00:00Z",
 * "contato_cliente": {
 * "id": "uuid-do-contato",
 * "nome": "Bruno",
 * "sobrenome": "Silva",
 * "cpf": "11122233344",
 * "email": "bruno@email.com"
 * },
 * "endereco_entrega": {
 * "id": "uuid-do-endereco",
 * "cep": "22231-020",
 * "logradouro": "Rua Nova",
 * "numero": 100,
 * "complemento": "Apto 202",
 * "bairro": "Bairro Novo",
 * "cidade": "Rio de Janeiro",
 * "uf": "RJ"
 * },
 * "info_entrega": {
 * "id": "uuid-da-entrega",
 * "entrega_estimada": "2025-09-20",
 * "rastreador": "Aguardando envio",
 * "transportadora": "SEDEX",
 * "preco_frete": "28.50",
 * "data_hora_finalizado": null
 * },
 * "valor_total": "428.40",
 * "url_pagamento": "https://mercadopago.com/...",
 * "itens": [
 * {
 * "id": "uuid-do-item-pedido",
 * "produto": {
 * "id": "uuid-do-produto",
 * "nome": "Anel Solitário",
 * "preco": "400.00",
 * "imagem_principal_url": "http://.../media/images/anel.webp"
 * },
 * "tamanho": {
 * "id": "uuid-do-tamanhoproduto",
 * "tamanho": { "id": "uuid-do-tamanho", "nome": "Aro", "valor": "18" }
 * },
 * "quantidade": 1,
 * "preco_unitario_congelado": "400.00",
 * "subtotal": "400,00"
 * }
 * ]
 * }
 */
export const getPedidoById = (pedidoId) => {
  // GET /api/pedidos/{pedidoId}/
  return apiClient.get(`/pedidos/${pedidoId}/`);
};