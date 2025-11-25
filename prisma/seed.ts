import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

// Pour Prisma 7, on utilise la configuration simple
const prisma = new PrismaClient()

async function main(): Promise<void> {
  console.log('🌱 Début du seeding de la base de données v0.2...')

  // Supprimer les données existantes (ordre important : relations)
  await prisma.transaction.deleteMany()
  await prisma.asset.deleteMany()
  await prisma.category.deleteMany()

  // 1. Créer les catégories
  const categoryActions = await prisma.category.create({
    data: { name: 'Actions', color: '#4CAF50' }
  })

  const categoryCrypto = await prisma.category.create({
    data: { name: 'Cryptomonnaies', color: '#FF9800' }
  })

  const categoryETF = await prisma.category.create({
    data: { name: 'ETF', color: '#2196F3' }
  })

  console.log('✅ 3 catégories créées')

  // 2. Créer les actifs
  const apple = await prisma.asset.create({
    data: {
      name: 'Apple Inc.',
      ticker: 'AAPL',
      currentPrice: 195.5,
      categoryId: categoryActions.id
    }
  })

  const microsoft = await prisma.asset.create({
    data: {
      name: 'Microsoft Corporation',
      ticker: 'MSFT',
      currentPrice: 420.0,
      categoryId: categoryActions.id
    }
  })

  const bitcoin = await prisma.asset.create({
    data: {
      name: 'Bitcoin',
      ticker: 'BTC',
      currentPrice: 98500.0,
      categoryId: categoryCrypto.id
    }
  })

  const sp500 = await prisma.asset.create({
    data: {
      name: 'S&P 500 ETF',
      ticker: 'SPY',
      currentPrice: 580.0,
      categoryId: categoryETF.id
    }
  })

  console.log('✅ 4 actifs créés')

  // 3. Créer des transactions de test
  await prisma.transaction.createMany({
    data: [
      {
        assetId: apple.id,
        type: 'BUY',
        quantity: 10,
        pricePerUnit: 150.0,
        fee: 5.0,
        date: new Date('2024-01-15')
      },
      {
        assetId: microsoft.id,
        type: 'BUY',
        quantity: 5,
        pricePerUnit: 400.0,
        fee: 5.0,
        date: new Date('2024-02-10')
      },
      {
        assetId: bitcoin.id,
        type: 'BUY',
        quantity: 0.01,
        pricePerUnit: 50000.0,
        fee: 10.0,
        date: new Date('2024-03-20')
      },
      {
        assetId: sp500.id,
        type: 'BUY',
        quantity: 3,
        pricePerUnit: 550.0,
        fee: 3.0,
        date: new Date('2024-02-05')
      },
      {
        assetId: microsoft.id,
        type: 'SELL',
        quantity: 2,
        pricePerUnit: 410.0,
        fee: 5.0,
        date: new Date('2024-03-05')
      }
    ]
  })

  console.log('✅ 5 transactions créées')
  console.log('📊 Base de données v0.2 peuplée avec succès')
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
