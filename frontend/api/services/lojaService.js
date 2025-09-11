import apiClient from '../api';

export const getLojas = () => {
  return apiClient.get('/api/lojas/');
};