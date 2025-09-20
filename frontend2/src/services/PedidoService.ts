import apiClient from './api/apiClient';
import { PedidoCreateInput, PedidoCreated } from './interfaces/apiInterfaces';

export const createPedido = async (data: PedidoCreateInput): Promise<PedidoCreated> => {
  const response = await apiClient.post<PedidoCreated>('/pedidos/', data);
  return response.data;
};