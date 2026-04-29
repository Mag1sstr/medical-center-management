import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/patients': 'http://localhost:3001',
      '/doctors': 'http://localhost:3001',
      '/appointments': 'http://localhost:3001',
      '/treatments': 'http://localhost:3001',
      '/analytics': 'http://localhost:3001',
      '/health': 'http://localhost:3001',
    },
  },
});
