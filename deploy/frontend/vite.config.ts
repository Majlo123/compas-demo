import path from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const isProduction = process.env.NODE_ENV === 'production';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: isProduction ? [] : true,
    watch: {
      usePolling: true,
      interval: 1000,
    },
    hmr: {
      host: 'localhost',
    },
    fs: {
      allow: [
        '/frontend',
        '/shared',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, '../shared'),
    },
  },
  build: {
    sourcemap: !isProduction,
    target: 'es2020',
    manifest: true,
  },
});
