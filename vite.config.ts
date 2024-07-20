/// <reference types="vitest" />

import { defineConfig } from 'vite';
import analog from '@analogjs/platform';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  build: {
    target: ['es2020'],
  },
  resolve: {
    mainFields: ['module'],
  },
  plugins: [
    analog({
      nitro: {
        output: {
          dir: './dist/analog/public',
          serverDir: './dist/analog/public',
        },
        routeRules: {
          '/api/v1/**': {
            cors: true,
            headers: {
              'Access-Control-Allow-Methods':
                'GET,HEAD,PUT,PATCH,POST,DELETE, OPTIONS',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Credentials': 'true',
              'Access-Control-Allow-Headers': '*',
            },
          },
        },
      },
      vite: {
        experimental: {
          supportAnalogFormat: true,
        },
      },
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    include: ['**/*.spec.ts'],
    reporters: ['default'],
  },
  define: {
    'import.meta.vitest': mode !== 'production',
  },
}));
