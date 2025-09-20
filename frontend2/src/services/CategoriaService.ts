import apiClient from './api/apiClient';
import { Categoria, UUID } from './interfaces/apiInterfaces';

export const getCategorias = async (): Promise<{ data: Categoria[] }> => {
  const response = await apiClient.get<Categoria[]>('/categorias/');
  return { data: response.data };
};

export const getCategoriaById = async (id: UUID): Promise<{ data: Categoria }> => {
  const response = await apiClient.get<Categoria>(`/categorias/${id}/`);
  return { data: response.data };
};

export const getTopCategorias = async (n: number): Promise<{ data: Categoria[] }> => {
  const response = await apiClient.get<Categoria[]>(`/categorias/top/${n}/`);
  return { data: response.data };
};