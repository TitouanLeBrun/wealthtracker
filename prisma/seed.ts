import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

// Pour Prisma 7, on utilise la configuration simple
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Début du seeding de la base de données...')

  // Supprimer les données existantes
  await prisma.transaction.deleteMany()

  // Créer des transactions de test
  await prisma.transaction.createMany({
    data: [
      { 
        label: 'Achat actions Apple', 
        amount: -1500, 
        date: new Date('2024-01-15') 
      },
      { 
        label: 'Dividendes Total', 
        amount: 45.30, 
        date: new Date('2024-02-01') 
      },
      { 
        label: 'Achat ETF S&P500', 
        amount: -2000, 
        date: new Date('2024-02-10') 
      },
      { 
        label: 'Vente actions Microsoft', 
        amount: 3200, 
        date: new Date('2024-03-05') 
      },
      { 
        label: 'Achat Bitcoin', 
        amount: -500, 
        date: new Date('2024-03-20') 
      },
    ]
  })

  console.log('✅ Base de données peuplée avec succès')
  console.log('📊 5 transactions créées')
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
