import apiClient from './api/apiClient';
import { ProdutoListItem, ProdutoDetail } from './interfaces/apiInterfaces';

interface ProdutoQueryParams {
  q?: string; // Busca
  'categorias__id'?: string; // Filtro por categoria
}

export const getProdutos = async (params?: ProdutoQueryParams): Promise<{ data: ProdutoListItem[] }> => {
  const response = await apiClient.get<ProdutoListItem[]>('/produtos/', { params });
  return { data: response.data };
};

export const getProdutoById = async (id: string): Promise<{ data: ProdutoDetail }> => {
  const response = await apiClient.get<ProdutoDetail>(`/produtos/${id}/`);
  return { data: response.data };
};

export const getProdutosRelacionados = async (id: string): Promise<{ data: ProdutoListItem[] }> => {
  const response = await apiClient.get<ProdutoListItem[]>(`/produtos/${id}/relacionados`);
  return { data: response.data };
};