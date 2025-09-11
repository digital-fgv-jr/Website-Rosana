import axios from 'axios';

const apiClient = axios.create({
  headers: {
    'X-API-Key': import.meta.env.VITE_API_KEY,
    'Content-Type': 'application/json',
  }
});

export default apiClient;