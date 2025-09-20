import apiClient from './api/apiClient';
import { Categoria, UUID } from './interfaces/apiInterfaces';

export const getCategorias = async (): Promise<Categoria[]> => {
  const response = await apiClient.get<Categoria[]>('/categorias/');
  return response.data;
};

export const getCategoriaById = async (id: UUID): Promise<Categoria> => {
  const response = await apiClient.get<Categoria>(`/categorias/${id}/`);
  return response.data;
};

export const getTopCategorias = async (n: number): Promise<Categoria[]> => {
  const response = await apiClient.get<Categoria[]>(`/categorias/top/${n}/`);
  return response.data;
};