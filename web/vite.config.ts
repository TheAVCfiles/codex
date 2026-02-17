import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5173,
    proxy: {
      '/forecast': 'http://api:8000',
      '/learn': 'http://api:8000',
      '/health': 'http://api:8000'
    }
  }
});
