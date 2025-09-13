import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL
const API_KEY = import.meta.env.VITE_API_KEY
console.log(API_URL)
console.log(API_KEY)

const apiClient = axios.create({
  baseURL: API_URL,
  
  headers: {
    'X-API-Key': API_KEY,
    'Content-Type': 'application/json',
  }
});

export default apiClient;