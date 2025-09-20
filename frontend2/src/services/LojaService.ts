import apiClient from './api/apiClient';
import { Loja, UUID } from './interfaces/apiInterfaces';

export const getLojas = async (): Promise<Loja[]> => {
  const response = await apiClient.get<Loja[]>('/lojas/');
  return response.data;
};

export const getLojaById = async (id: UUID): Promise<Loja> => {
  const response = await apiClient.get<Loja>(`/lojas/${id}/`);
  return response.data;
};