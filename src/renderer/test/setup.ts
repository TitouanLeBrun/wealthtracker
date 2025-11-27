import '@testing-library/jest-dom'
import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import type { API } from '../../preload/index.d'

// Nettoyage automatique après chaque test
afterEach(() => {
  cleanup()
})

// Mock de window.api pour les tests
global.window.api = {
  getAllAssets: vi.fn(),
  getAllTransactions: vi.fn(),
  getAllCategories: vi.fn(),
  getCurrentObjective: vi.fn(),
  createObjective: vi.fn(),
  updateObjective: vi.fn(),
  createTransaction: vi.fn(),
  deleteTransaction: vi.fn(),
  createCategory: vi.fn(),
  createAsset: vi.fn(),
  updateAssetPrice: vi.fn(),
  deleteAsset: vi.fn()
} as unknown as API
