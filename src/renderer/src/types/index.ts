// Type pour les transactions (correspond au modèle Prisma)
export interface Transaction {
  id: number
  label: string
  amount: number
  date: Date
  createdAt: Date
}

// Type pour les données du formulaire
export interface TransactionFormData {
  label: string
  amount: number
  date: Date
}

// Type pour les notifications
export interface NotificationMessage {
  type: 'success' | 'error'
  text: string
}
