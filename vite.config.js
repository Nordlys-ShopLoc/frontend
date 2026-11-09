import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Same origin as in production (nginx): API calls go to the gateway
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
})
