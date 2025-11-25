// Types pour les catégories
export interface Category {
  id: number
  name: string
  color: string
}

// Types pour les actifs financiers
export interface Asset {
  id: number
  name: string
  ticker: string
  currentPrice: number
  categoryId: number
  category?: Category // Relation optionnelle
  createdAt: Date
}

// Type pour les transactions (correspond au modèle Prisma v0.2)
export interface Transaction {
  id: number
  assetId: number
  asset?: Asset // Relation optionnelle
  type: 'BUY' | 'SELL'
  quantity: number
  pricePerUnit: number
  fee: number
  date: Date
  createdAt: Date
}

// Type pour les données du formulaire de transaction
export interface TransactionFormData {
  assetId: number
  type: 'BUY' | 'SELL'
  quantity: number
  pricePerUnit: number
  fee: number
  date: Date
}

// Type pour les données du formulaire de catégorie
export interface CategoryFormData {
  name: string
  color: string
}

// Type pour les données du formulaire d'actif
export interface AssetFormData {
  name: string
  ticker: string
  currentPrice: number
  categoryId: number
}

// Type pour les notifications
export interface NotificationMessage {
  type: 'success' | 'error'
  text: string
}

// Types pour les calculs de valeur par actif
export interface AssetValue {
  assetId: number
  ticker: string
  name: string
  currentPrice: number
  netQuantity: number // Quantité nette (achats - ventes)
  totalValue: number // currentPrice × netQuantity
  percentage: number // % au sein de la catégorie
}

// Types pour les calculs de valeur par catégorie
export interface CategoryValue {
  categoryId: number
  categoryName: string
  color: string
  totalValue: number // Somme des valeurs des actifs
  percentage: number // % du total global
  assetCount: number // Nombre d'actifs avec quantité > 0
  assets: AssetValue[] // Détails par actif
}

// Types pour la performance d'un actif (Dashboard)
export interface AssetPerformance {
  assetId: number
  ticker: string
  name: string
  categoryName: string
  categoryColor: string
  netQuantity: number // Quantité nette possédée
  currentPrice: number // Prix du marché actuel
  averageBuyPrice: number // PMA (Prix Moyen Pondéré d'Achat avec frais)
  currentValue: number // Valeur actuelle (prix × quantité)
  investedValue: number // Valeur investie (PMA × quantité)
  unrealizedPnL: number // Plus/Moins-Value latente (€)
  unrealizedPnLPercent: number // Plus/Moins-Value latente (%)
}

// Types pour les métriques globales du portefeuille (Dashboard)
export interface PortfolioMetrics {
  totalValue: number // Valeur totale actuelle du portefeuille
  totalInvested: number // Montant total investi
  unrealizedPnL: number // Plus/Moins-Value latente globale (€)
  unrealizedPnLPercent: number // Plus/Moins-Value latente globale (%)
  assetCount: number // Nombre d'actifs en position ouverte
  assets: AssetPerformance[] // Détails par actif
}
