import { PrismaClient } from '@prisma/client'
import { app } from 'electron'
import path from 'path'
import fs from 'fs'

let prisma: PrismaClient | null = null

export function getPrismaClient(): PrismaClient {
  if (prisma) return prisma

  // Déterminer le chemin de la DB selon l'environnement
  const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged
  const dbPath = isDev
    ? path.join(process.cwd(), 'prisma', 'dev.db')
    : path.join(app.getPath('userData'), 'database.db')

  console.log(`[Prisma] Using database at: ${dbPath}`)

  // Créer le dossier si nécessaire
  const dbDir = path.dirname(dbPath)
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true })
  }

  // En production, copier le fichier de schéma si absent
  if (!isDev && !fs.existsSync(dbPath)) {
    const seedDbPath = path.join(process.resourcesPath, 'prisma', 'dev.db')
    if (fs.existsSync(seedDbPath)) {
      fs.copyFileSync(seedDbPath, dbPath)
      console.log(`[Prisma] Database copied from ${seedDbPath} to ${dbPath}`)
    }
  }

  // Créer le client Prisma (Prisma 7 style - pas de datasources dans le constructeur)
  // La configuration de l'URL se fait via les variables d'environnement ou prisma.config.ts
  prisma = new PrismaClient({
    log: isDev ? ['query', 'error', 'warn'] : ['error']
  })

  return prisma
}

export async function closePrismaClient(): Promise<void> {
  if (prisma) {
    await prisma.$disconnect()
    prisma = null
    console.log('[Prisma] Database connection closed')
  }
}
