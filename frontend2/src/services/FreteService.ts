import apiClient from './api/apiClient';
import { FreteQuoteInput, FreteOption } from './interfaces/apiInterfaces';

export const cotarFrete = async (data: FreteQuoteInput): Promise<{ data: FreteOption[] }> => {
  const response = await apiClient.post<FreteOption[]>('/cotar-frete/', data);
  return { data: response.data };
};