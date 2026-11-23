import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true, // 0.0.0.0 bind karta hai taake local machine aur Docker containers access kar sakein
  },
  preview: {
    port: 3000,
  },
});