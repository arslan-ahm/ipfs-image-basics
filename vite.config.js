import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: [
        '@glennsl/bs-json/lib/js/src/Json_decode.bs.js',
        'bs-platform/lib/js/js_primitive.js',
      ],
    },
  },
  optimizeDeps: {
    exclude: ['pinata-sdk', 'bs-fetch', '@glennsl/bs-json', 'bs-platform'],
  },
});