import { describe, it, expect } from 'vitest'
// TODO: Implémenter ces fonctions dans wealthCalculations.ts
// import {
//   calculateWealthBreakdown,
//   calculateWealthByCategory
// } from '../src/utils/calculations/wealthCalculations'

// Types de test
interface Asset {
  id: number
  name: string
  categoryId: number
  currentPrice: number
  transactions: Transaction[]
}

interface Transaction {
  id: number
  type: 'BUY' | 'SELL'
  quantity: number
  pricePerUnit: number
  fee: number
  date: Date
}

interface Category {
  id: number
  name: string
  color: string
}

// TODO: Implémenter les fonctions calculateWealthBreakdown et calculateWealthByCategory
describe.skip('Calculs de Patrimoine', () => {
  describe('calculateWealthBreakdown', () => {
    it('devrait calculer correctement le patrimoine avec achats uniquement', () => {
      const assets: Asset[] = [
        {
          id: 1,
          name: 'Bitcoin',
          categoryId: 1,
          currentPrice: 50000,
          transactions: [
            {
              id: 1,
              type: 'BUY',
              quantity: 0.5,
              pricePerUnit: 40000,
              fee: 50,
              date: new Date('2023-01-01')
            },
            {
              id: 2,
              type: 'BUY',
              quantity: 0.3,
              pricePerUnit: 45000,
              fee: 30,
              date: new Date('2023-06-01')
            }
          ]
        }
      ]

      const breakdown = calculateWealthBreakdown(assets)

      // Quantité totale : 0.5 + 0.3 = 0.8 BTC
      // Valeur actuelle : 0.8 × 50000 = 40 000€
      // Investissement total : (0.5 × 40000 + 50) + (0.3 × 45000 + 30) = 20050 + 13530 = 33 580€
      // Plus-value : 40000 - 33580 = 6 420€

      expect(breakdown.totalWealth).toBe(40000)
      expect(breakdown.totalInvested).toBe(33580)
      expect(breakdown.totalGainLoss).toBe(6420)
      expect(breakdown.totalGainLossPercent).toBeCloseTo(19.11, 1)
    })

    it('devrait gérer les achats et les ventes', () => {
      const assets: Asset[] = [
        {
          id: 1,
          name: 'Apple Stock',
          categoryId: 2,
          currentPrice: 180,
          transactions: [
            {
              id: 1,
              type: 'BUY',
              quantity: 100,
              pricePerUnit: 150,
              fee: 10,
              date: new Date('2023-01-01')
            },
            {
              id: 2,
              type: 'SELL',
              quantity: 30,
              pricePerUnit: 170,
              fee: 5,
              date: new Date('2023-06-01')
            }
          ]
        }
      ]

      const breakdown = calculateWealthBreakdown(assets)

      // Quantité restante : 100 - 30 = 70 actions
      // Valeur actuelle : 70 × 180 = 12 600€
      // Investissement : (100 × 150 + 10) - (30 × 170 - 5) = 15010 - 5095 = 9 915€
      // Plus-value : 12600 - 9915 = 2 685€

      expect(breakdown.totalWealth).toBe(12600)
      expect(breakdown.totalInvested).toBe(9915)
      expect(breakdown.totalGainLoss).toBe(2685)
    })

    it("devrait retourner 0 s'il n'y a pas d'actifs", () => {
      const assets: Asset[] = []
      const breakdown = calculateWealthBreakdown(assets)

      expect(breakdown.totalWealth).toBe(0)
      expect(breakdown.totalInvested).toBe(0)
      expect(breakdown.totalGainLoss).toBe(0)
      expect(breakdown.totalGainLossPercent).toBe(0)
    })

    it('devrait gérer les pertes (valeur actuelle < investissement)', () => {
      const assets: Asset[] = [
        {
          id: 1,
          name: 'Crypto X',
          categoryId: 1,
          currentPrice: 50, // Prix a chuté
          transactions: [
            {
              id: 1,
              type: 'BUY',
              quantity: 100,
              pricePerUnit: 100, // Acheté à 100€
              fee: 20,
              date: new Date('2023-01-01')
            }
          ]
        }
      ]

      const breakdown = calculateWealthBreakdown(assets)

      // Valeur actuelle : 100 × 50 = 5 000€
      // Investissement : 100 × 100 + 20 = 10 020€
      // Perte : 5000 - 10020 = -5 020€

      expect(breakdown.totalWealth).toBe(5000)
      expect(breakdown.totalInvested).toBe(10020)
      expect(breakdown.totalGainLoss).toBe(-5020)
      expect(breakdown.totalGainLossPercent).toBeCloseTo(-50.1, 1)
    })

    it('devrait agréger plusieurs actifs', () => {
      const assets: Asset[] = [
        {
          id: 1,
          name: 'Asset 1',
          categoryId: 1,
          currentPrice: 100,
          transactions: [
            {
              id: 1,
              type: 'BUY',
              quantity: 10,
              pricePerUnit: 90,
              fee: 5,
              date: new Date('2023-01-01')
            }
          ]
        },
        {
          id: 2,
          name: 'Asset 2',
          categoryId: 2,
          currentPrice: 200,
          transactions: [
            {
              id: 2,
              type: 'BUY',
              quantity: 5,
              pricePerUnit: 180,
              fee: 10,
              date: new Date('2023-01-01')
            }
          ]
        }
      ]

      const breakdown = calculateWealthBreakdown(assets)

      // Asset 1 : Valeur = 10 × 100 = 1000€, Investi = 10 × 90 + 5 = 905€
      // Asset 2 : Valeur = 5 × 200 = 1000€, Investi = 5 × 180 + 10 = 910€
      // Total : Valeur = 2000€, Investi = 1815€, Gain = 185€

      expect(breakdown.totalWealth).toBe(2000)
      expect(breakdown.totalInvested).toBe(1815)
      expect(breakdown.totalGainLoss).toBe(185)
    })
  })

  describe('calculateWealthByCategory', () => {
    it('devrait calculer le patrimoine par catégorie', () => {
      const assets: Asset[] = [
        {
          id: 1,
          name: 'Bitcoin',
          categoryId: 1,
          currentPrice: 50000,
          transactions: [
            {
              id: 1,
              type: 'BUY',
              quantity: 1,
              pricePerUnit: 40000,
              fee: 50,
              date: new Date('2023-01-01')
            }
          ]
        },
        {
          id: 2,
          name: 'Ethereum',
          categoryId: 1,
          currentPrice: 3000,
          transactions: [
            {
              id: 2,
              type: 'BUY',
              quantity: 5,
              pricePerUnit: 2500,
              fee: 25,
              date: new Date('2023-01-01')
            }
          ]
        },
        {
          id: 3,
          name: 'Apple',
          categoryId: 2,
          currentPrice: 180,
          transactions: [
            {
              id: 3,
              type: 'BUY',
              quantity: 50,
              pricePerUnit: 150,
              fee: 10,
              date: new Date('2023-01-01')
            }
          ]
        }
      ]

      const categories: Category[] = [
        { id: 1, name: 'Crypto', color: '#FF6B6B' },
        { id: 2, name: 'Actions', color: '#4ECDC4' }
      ]

      const wealthByCategory = calculateWealthByCategory(assets, categories)

      // Crypto (cat 1) : Bitcoin (50000) + Ethereum (15000) = 65 000€
      // Actions (cat 2) : Apple (9000) = 9 000€
      // Total : 74 000€

      expect(wealthByCategory).toHaveLength(2)

      const crypto = wealthByCategory.find((c) => c.categoryId === 1)
      expect(crypto?.wealth).toBe(65000)
      expect(crypto?.percentage).toBeCloseTo(87.84, 1)

      const stocks = wealthByCategory.find((c) => c.categoryId === 2)
      expect(stocks?.wealth).toBe(9000)
      expect(stocks?.percentage).toBeCloseTo(12.16, 1)
    })

    it('devrait exclure les catégories sans actifs', () => {
      const assets: Asset[] = [
        {
          id: 1,
          name: 'Bitcoin',
          categoryId: 1,
          currentPrice: 50000,
          transactions: [
            {
              id: 1,
              type: 'BUY',
              quantity: 1,
              pricePerUnit: 40000,
              fee: 50,
              date: new Date('2023-01-01')
            }
          ]
        }
      ]

      const categories: Category[] = [
        { id: 1, name: 'Crypto', color: '#FF6B6B' },
        { id: 2, name: 'Actions', color: '#4ECDC4' },
        { id: 3, name: 'Obligations', color: '#95E1D3' }
      ]

      const wealthByCategory = calculateWealthByCategory(assets, categories)

      // Seule la catégorie Crypto doit apparaître
      expect(wealthByCategory).toHaveLength(1)
      expect(wealthByCategory[0].categoryId).toBe(1)
      expect(wealthByCategory[0].wealth).toBe(50000)
      expect(wealthByCategory[0].percentage).toBe(100)
    })

    it("devrait retourner un tableau vide s'il n'y a pas d'actifs", () => {
      const assets: Asset[] = []
      const categories: Category[] = [{ id: 1, name: 'Crypto', color: '#FF6B6B' }]

      const wealthByCategory = calculateWealthByCategory(assets, categories)

      expect(wealthByCategory).toHaveLength(0)
    })
  })
})
