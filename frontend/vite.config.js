import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'

export default defineConfig({
  plugins: [react()],
  server: {
    // Permite que o servidor seja acessado pela rede do Docker
    host: true, 
    // Porta padrão do Vite
    port: 5173, 
    // Configuração do proxy
    proxy: {
      // Qualquer requisição para /api será redirecionada para o backend
      '/api': {
        target: 'http://backend:8000', // 'backend' é o nome do serviço no docker-compose
        changeOrigin: true,
        secure: false,
      },
    },
  },
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  }
})
