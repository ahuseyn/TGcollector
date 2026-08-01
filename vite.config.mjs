import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      include: ['buffer', 'process'],
      globals: {
        Buffer: true,
        process: true,
      },
    }),
  ],
  resolve: {
    alias: {
      components: fileURLToPath(new URL('./src/components', import.meta.url)),
      constants: fileURLToPath(new URL('./src/constants', import.meta.url)),
      helpers: fileURLToPath(new URL('./src/helpers', import.meta.url)),
      pages: fileURLToPath(new URL('./src/pages', import.meta.url)),
      store: fileURLToPath(new URL('./src/store', import.meta.url)),
      client: fileURLToPath(new URL('./src/client', import.meta.url))
    },
  },
  optimizeDeps: {
    exclude: ['@mtcute/wasm'],
  },
  server: {
    port: 3000,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.js',
    exclude: ['tests/e2e/**', 'node_modules/**', 'dist/**'],
  },
});
