import { defineConfig } from 'vitest/config'

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
  }
})
