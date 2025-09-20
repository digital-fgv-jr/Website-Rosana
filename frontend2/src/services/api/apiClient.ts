import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const API_URL: string = import.meta.env.VITE_API_URL ?? '';
const API_KEY: string = import.meta.env.VITE_API_KEY ?? '';

if (!API_URL || !API_KEY) {
  throw new Error('As variáveis de ambiente VITE_API_URL e VITE_API_KEY devem estar definidas.');
}

const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'X-API-Key': API_KEY,
    'Content-Type': 'application/json',
  },
} as AxiosRequestConfig);

export default apiClient;