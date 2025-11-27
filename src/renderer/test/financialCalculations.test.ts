import { describe, it, expect } from 'vitest'
import {
  calculateMonthlyPayment,
  calculateFutureValue,
  calculateCAGR
} from '../src/utils/calculations/financialCalculations'

describe('Calculs Financiers', () => {
  describe('calculateMonthlyPayment', () => {
    it('devrait calculer le versement mensuel requis pour atteindre un objectif', () => {
      // Scénario : Atteindre 10 000€ en 2 ans avec 5% d'intérêt annuel, en partant de 0€
      const pv = 0 // Valeur actuelle
      const fv = 10000 // Valeur cible
      const annualRate = 5 // Taux annuel en %
      const years = 2 // Durée en années

      const monthlyPayment = calculateMonthlyPayment(pv, fv, annualRate, years)

      // Attendu : environ 400€/mois
      expect(monthlyPayment).toBeGreaterThan(390)
      expect(monthlyPayment).toBeLessThan(410)
    })

    it("devrait retourner 0 si le patrimoine actuel dépasse déjà l'objectif", () => {
      const pv = 15000 // Patrimoine actuel déjà supérieur
      const fv = 10000 // Objectif
      const annualRate = 5
      const years = 2

      const monthlyPayment = calculateMonthlyPayment(pv, fv, annualRate, years)

      expect(monthlyPayment).toBe(0)
    })

    it('devrait calculer un versement mensuel plus élevé si on est en retard', () => {
      const pv = 2000 // On a déjà 2000€
      const fv = 10000 // Objectif 10 000€
      const annualRate = 5
      const years = 1 // Il reste seulement 1 an

      const monthlyPayment = calculateMonthlyPayment(pv, fv, annualRate, years)

      // Le versement doit être élevé car il reste peu de temps
      // Ajustement de la tolérance basé sur la formule réelle
      expect(monthlyPayment).toBeGreaterThan(640)
      expect(monthlyPayment).toBeLessThan(670)
    })

    it('devrait gérer le cas où le temps restant est 0', () => {
      const pv = 5000
      const fv = 10000
      const annualRate = 5
      const years = 0

      const monthlyPayment = calculateMonthlyPayment(pv, fv, annualRate, years)

      expect(monthlyPayment).toBe(0)
    })

    it("devrait calculer correctement avec un taux d'intérêt à 0%", () => {
      const pv = 0
      const fv = 12000 // 12 000€
      const annualRate = 0 // Pas d'intérêts
      const years = 2 // 24 mois

      const monthlyPayment = calculateMonthlyPayment(pv, fv, annualRate, years)

      // Sans intérêts : 12000 / 24 = 500€/mois
      expect(monthlyPayment).toBeCloseTo(500, 1)
    })
  })

  describe('calculateFutureValue', () => {
    it('devrait calculer la valeur future avec versements mensuels', () => {
      const pv = 1000 // On part de 1000€
      const pmt = 100 // On investit 100€/mois
      const annualRate = 6 // 6% annuel
      const years = 5

      const fv = calculateFutureValue(pv, pmt, annualRate, years)

      // Attendu : environ 8 315€ (formule exacte avec taux mensuel)
      expect(fv).toBeGreaterThan(8250)
      expect(fv).toBeLessThan(8350)
    })

    it('devrait calculer la valeur future sans versements (capital initial uniquement)', () => {
      const pv = 5000
      const pmt = 0 // Aucun versement
      const annualRate = 5
      const years = 10

      const fv = calculateFutureValue(pv, pmt, annualRate, years)

      // Formule : FV = PV × (1 + r)^n
      // 5000 × (1.05)^10 ≈ 8144€
      expect(fv).toBeGreaterThan(8100)
      expect(fv).toBeLessThan(8200)
    })

    it('devrait retourner la somme des versements si taux = 0%', () => {
      const pv = 1000
      const pmt = 200
      const annualRate = 0
      const years = 2 // 24 mois

      const fv = calculateFutureValue(pv, pmt, annualRate, years)

      // 1000 + (200 × 24) = 5800€
      expect(fv).toBeCloseTo(5800, 0)
    })

    it('devrait gérer correctement les petites durées (< 1 an)', () => {
      const pv = 1000
      const pmt = 500
      const annualRate = 12
      const years = 0.5 // 6 mois

      const fv = calculateFutureValue(pv, pmt, annualRate, years)

      expect(fv).toBeGreaterThan(0)
      expect(fv).toBeGreaterThan(pv) // Doit être supérieur à la valeur initiale
    })
  })

  describe('calculateCAGR', () => {
    it('devrait calculer le taux de croissance annuel composé', () => {
      const beginValue = 1000
      const endValue = 2000 // Doublement
      const years = 10

      const cagr = calculateCAGR(beginValue, endValue, years)

      // CAGR pour doubler en 10 ans ≈ 7.18%
      expect(cagr).toBeGreaterThan(7)
      expect(cagr).toBeLessThan(7.5)
    })

    it('devrait retourner 0 si aucune croissance', () => {
      const beginValue = 5000
      const endValue = 5000
      const years = 5

      const cagr = calculateCAGR(beginValue, endValue, years)

      expect(cagr).toBe(0)
    })

    it('devrait retourner un CAGR négatif en cas de perte', () => {
      const beginValue = 10000
      const endValue = 8000 // Perte de 20%
      const years = 2

      const cagr = calculateCAGR(beginValue, endValue, years)

      expect(cagr).toBeLessThan(0)
      expect(cagr).toBeGreaterThan(-11)
      expect(cagr).toBeLessThan(-9)
    })

    it('devrait gérer le cas où la valeur initiale est 0', () => {
      const beginValue = 0
      const endValue = 5000
      const years = 5

      const cagr = calculateCAGR(beginValue, endValue, years)

      expect(cagr).toBe(0) // Division par 0 gérée
    })

    it('devrait gérer le cas où le temps est 0', () => {
      const beginValue = 1000
      const endValue = 2000
      const years = 0

      const cagr = calculateCAGR(beginValue, endValue, years)

      expect(cagr).toBe(0)
    })
  })

  describe('Cas limites et cohérence', () => {
    it('PMT calculé puis réinjecté dans FV devrait donner la valeur cible', () => {
      const targetAmount = 50000
      const annualRate = 6
      const years = 10
      const pv = 10000

      // Étape 1 : Calculer le versement mensuel requis
      const pmt = calculateMonthlyPayment(pv, targetAmount, annualRate, years)

      // Étape 2 : Calculer la valeur future avec ce versement
      const fv = calculateFutureValue(pv, pmt, annualRate, years)

      // La valeur future doit être proche de la cible
      expect(fv).toBeCloseTo(targetAmount, 0) // Tolérance de 1€
    })

    it('Versement mensuel doit augmenter si le temps diminue', () => {
      const pv = 5000
      const fv = 20000
      const annualRate = 5

      const pmt5years = calculateMonthlyPayment(pv, fv, annualRate, 5)
      const pmt3years = calculateMonthlyPayment(pv, fv, annualRate, 3)
      const pmt1year = calculateMonthlyPayment(pv, fv, annualRate, 1)

      expect(pmt3years).toBeGreaterThan(pmt5years)
      expect(pmt1year).toBeGreaterThan(pmt3years)
    })

    it("Valeur future doit augmenter avec le taux d'intérêt", () => {
      const pv = 1000
      const pmt = 200
      const years = 5

      const fv3pct = calculateFutureValue(pv, pmt, 3, years)
      const fv6pct = calculateFutureValue(pv, pmt, 6, years)
      const fv9pct = calculateFutureValue(pv, pmt, 9, years)

      expect(fv6pct).toBeGreaterThan(fv3pct)
      expect(fv9pct).toBeGreaterThan(fv6pct)
    })
  })
})
