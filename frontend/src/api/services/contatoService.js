import apiClient from '../api';

/**
 * Busca a lista de todos os contatos que são clientes (não são lojas).
 * @returns {Promise<AxiosResponse<Array<object>>>} Uma Promessa que resolve para a resposta da API.
 * * @example
 * // Exemplo de como a resposta (`response.data`) será estruturada:
 * [
 * {
 * "id": "uuid-do-cliente-1",
 * "nome": "João",
 * "sobrenome": "Silva",
 * "cpf": "11122233344",
 * "email": "joao.silva@email.com"
 * },
 * {
 * "id": "uuid-do-cliente-2",
 * "nome": "Maria",
 * "sobrenome": "Santos",
 * "cpf": "55566677788",
 * "email": "maria.santos@email.com"
 * }
 * ]
 */
export const getContatosClientes = () => {
  // GET /api/contatos-clientes/
  return apiClient.get('/contatos-clientes/');
};

/**
 * Busca a lista de todos os contatos que são de lojas.
 * @returns {Promise<AxiosResponse<Array<object>>>} Uma Promessa que resolve para a resposta da API.
 * * @example
 * // Exemplo de como a resposta (`response.data`) será estruturada:
 * [
 * {
 * "id": "uuid-do-contato-loja-1",
 * "nome": "Loja",
 * "sobrenome": "Teste",
 * "cpf": "68910258004",
 * "email": "loja@teste.api",
 * "contatoloja": {
 * "whatsapp": "(12) 34567-8901",
 * "telefone": "(12) 34567-8901",
 * "instagram": "@api.test",
 * "cnpj": "12.345.678/9012-34"
 * }
 * }
 * ]
 */
export const getContatosLojas = () => {
  // GET /api/contatos-lojas/
  return apiClient.get('/contatos-lojas/');
};