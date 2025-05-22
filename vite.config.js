import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  esbuild: {
    target: 'esnext',
    supported: {
      'top-level-await': true
    },
  },
  build: {
    target: 'esnext',
  },
  server: {
    port: process.env.PORT || 3000,
  },
}) 