/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const frankfurterProxy = {
  target: 'https://api.frankfurter.app',
  changeOrigin: true,
  secure: true,
  rewrite: (path: string) => path.replace(/^\/api\/frankfurter/, ''),
}

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/frankfurter': frankfurterProxy,
    },
  },
  preview: {
    proxy: {
      '/api/frankfurter': frankfurterProxy,
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
})
