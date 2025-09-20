import apiClient from './api/apiClient';
import { Loja, UUID } from './interfaces/apiInterfaces';

export const getLojas = async (): Promise<{ data: Loja[] }> => {
  const response = await apiClient.get<Loja[]>('/lojas/');
  return { data: response.data };
};

export const getLojaById = async (id: UUID): Promise<{data: Loja }> => {
  const response = await apiClient.get<Loja>(`/lojas/${id}/`);
  return { data: response.data };
};