import { defineConfig } from 'vite';

const target = process.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

export default defineConfig({
  server: {
    port: 5173,
    proxy: {
      '/forecast': target,
      '/learn': target,
      '/health': target,
    },
  },
});
