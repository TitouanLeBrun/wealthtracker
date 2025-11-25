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
