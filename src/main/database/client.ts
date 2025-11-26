import { app } from 'electron'
import path from 'path'
import fs from 'fs'
import type { PrismaClient } from '@prisma/client'

let prisma: PrismaClient | null = null

// Initialiser DATABASE_URL AVANT toute chose
function initDatabaseUrl(): string {
  const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged
  const dbPath = isDev
    ? path.join(process.cwd(), 'prisma', 'dev.db')
    : path.join(app.getPath('userData'), 'database.db')

  const databaseUrl = `file:${dbPath}`

  // IMPORTANT: Définir DATABASE_URL AVANT d'importer PrismaClient
  if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = databaseUrl
    console.log(`[Prisma] DATABASE_URL initialized to: ${databaseUrl}`)
  }

  return dbPath
}

export async function getPrismaClient(): Promise<PrismaClient> {
  if (prisma) return prisma

  // Initialiser DATABASE_URL en premier
  const dbPath = initDatabaseUrl()

  console.log(`[Prisma] Using database at: ${dbPath}`)

  // Créer le dossier si nécessaire
  const dbDir = path.dirname(dbPath)
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true })
  }

  // En production, copier le fichier de schéma si absent
  const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged
  if (!isDev && !fs.existsSync(dbPath)) {
    const seedDbPath = path.join(process.resourcesPath, 'prisma', 'dev.db')
    if (fs.existsSync(seedDbPath)) {
      fs.copyFileSync(seedDbPath, dbPath)
      console.log(`[Prisma] Database copied from ${seedDbPath} to ${dbPath}`)
    }
  }

  // Import dynamique pour éviter que Prisma ne charge avant DATABASE_URL
  const { PrismaClient: PC } = await import('@prisma/client')

  // En production packagée, configurer le chemin du query engine
  interface PrismaOptions {
    datasources: {
      db: {
        url: string
      }
    }
    log: string[]
    __internal?: {
      engine?: {
        binaryPath?: string
      }
    }
  }

  const prismaOptions: PrismaOptions = {
    datasources: {
      db: {
        url: process.env.DATABASE_URL!
      }
    },
    log: isDev ? ['query', 'error', 'warn'] : ['error']
  }

  // Si en production packagée, spécifier le chemin du query engine
  if (!isDev && process.resourcesPath) {
    const enginePath = path.join(
      process.resourcesPath,
      'node_modules',
      '.prisma',
      'client',
      'query_engine-windows.dll.node'
    )
    if (fs.existsSync(enginePath)) {
      prismaOptions.__internal = {
        engine: {
          binaryPath: enginePath
        }
      }
      console.log(`[Prisma] Using query engine at: ${enginePath}`)
    }
  }

  // Créer le client Prisma avec l'URL explicite
  prisma = new PC(prismaOptions as never) as PrismaClient

  return prisma
}

export async function closePrismaClient(): Promise<void> {
  if (prisma) {
    await prisma.$disconnect()
    prisma = null
    console.log('[Prisma] Database connection closed')
  }
}
