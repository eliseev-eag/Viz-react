import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      src: path.resolve('src/'),
    },
  },
  server: {
    port: 3000,
  },
});
