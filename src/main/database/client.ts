import { app } from 'electron'
import path from 'path'
import fs from 'fs'
import { exec } from 'child_process'
import { promisify } from 'util'
import type { PrismaClient } from '@prisma/client'

const execAsync = promisify(exec)
let prisma: PrismaClient | null = null

function getDatabasePath(): string {
  const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged

  if (isDev) {
    // En développement : DATABASE_URL est défini par le script npm (npm run dev)
    return path.join(process.cwd(), 'prisma', 'dev.db')
  } else {
    // En production : base de données dans AppData
    return path.join(app.getPath('userData'), 'database.db')
  }
}

/**
 * Applique les migrations Prisma si la base de données est vide ou incomplète
 */
async function applyMigrationsIfNeeded(dbPath: string, isDev: boolean): Promise<void> {
  const dbExists = fs.existsSync(dbPath)
  
  if (isDev) {
    // En développement : toujours vérifier et appliquer les migrations manquantes
    try {
      if (!dbExists) {
        console.log('[Prisma] Database does not exist, applying all migrations...')
      } else {
        console.log('[Prisma] Checking for pending migrations...')
      }

      // Utiliser prisma migrate deploy pour appliquer toutes les migrations en attente
      const { stdout, stderr } = await execAsync('npx prisma migrate deploy', {
        cwd: process.cwd(),
        env: { ...process.env, DATABASE_URL: `file:${dbPath}` }
      })
      
      // Vérifier s'il y avait des migrations en attente
      if (stdout.includes('No pending migrations')) {
        console.log('[Prisma] All migrations already applied')
      } else if (stdout.includes('migration') || stdout.includes('applied')) {
        console.log('[Prisma] ✅ Migrations applied successfully')
        if (stdout) console.log(stdout)
      }
      
      if (stderr && !stderr.includes('warn')) {
        console.warn('[Prisma] Migration warnings:', stderr)
      }
    } catch (error) {
      console.error('[Prisma] ❌ Failed to apply migrations:', error)
      
      // Si c'est une erreur critique, on la propage
      if (!dbExists) {
        throw error
      }
      // Sinon on continue avec la base existante
      console.warn('[Prisma] Continuing with existing database despite migration errors')
    }
  } else {
    // En production : copier la base pré-migrée depuis les resources si elle n'existe pas
    if (!dbExists) {
      console.log('[Prisma] Database does not exist in production, copying from resources...')
      const seedDbPath = path.join(process.resourcesPath, 'prisma', 'dev.db')
      if (fs.existsSync(seedDbPath)) {
        fs.copyFileSync(seedDbPath, dbPath)
        console.log(`[Prisma] ✅ Initial database copied from resources to: ${dbPath}`)
      } else {
        console.error('[Prisma] ❌ No seed database found in resources!')
        throw new Error('Production database missing and no seed database found')
      }
    } else {
      console.log('[Prisma] Production database exists at:', dbPath)
    }
  }
}

export async function getPrismaClient(): Promise<PrismaClient> {
  if (prisma) return prisma

  const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged
  const dbPath = getDatabasePath()

  console.log(`[Prisma] Using database at: ${dbPath}`)
  console.log(`[Prisma] isDev: ${isDev}`)
  console.log(`[Prisma] Current DATABASE_URL: ${process.env.DATABASE_URL}`)

  // Créer le dossier si nécessaire
  const dbDir = path.dirname(dbPath)
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true })
  }

  // ✅ NOUVELLE FONCTIONNALITÉ : Appliquer les migrations automatiquement si nécessaire
  await applyMigrationsIfNeeded(dbPath, isDev)

  // ✅ CORRECTION : Définir DATABASE_URL dans TOUS les cas
  const databaseUrl = `file:${dbPath}`
  process.env.DATABASE_URL = databaseUrl
  console.log(`[Prisma] Setting DATABASE_URL to: ${databaseUrl}`)

  // Import dynamique de PrismaClient
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
        url: databaseUrl // Utiliser l'URL explicite calculée
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
