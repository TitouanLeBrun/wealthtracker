import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/renderer/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/renderer/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData',
        'dist/'
      ]
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src/renderer/src'),
      '@main': resolve(__dirname, './src/main'),
      '@preload': resolve(__dirname, './src/preload')
    }
  }
})
