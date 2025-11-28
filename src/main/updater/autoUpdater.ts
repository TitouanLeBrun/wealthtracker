import { autoUpdater } from 'electron-updater'
import { BrowserWindow } from 'electron'
import logger from 'electron-log'
import type { IUpdater } from './IUpdater'

// Configuration du logger pour electron-updater
autoUpdater.logger = logger
if (
  autoUpdater.logger &&
  typeof autoUpdater.logger === 'object' &&
  'transports' in autoUpdater.logger
) {
  // @ts-ignore - electron-log types
  autoUpdater.logger.transports.file.level = 'info'
}

// Configuration de base
autoUpdater.autoDownload = false // Téléchargement manuel uniquement
autoUpdater.autoInstallOnAppQuit = true // Installation automatique à la fermeture

export class AppUpdater implements IUpdater {
  private mainWindow: BrowserWindow | null = null
  private updateCheckTimeout: NodeJS.Timeout | null = null

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow
    this.setupEventListeners()
  }

  /**
   * Configure les écouteurs d'événements de l'auto-updater
   */
  private setupEventListeners(): void {
    // Vérifie si une mise à jour est disponible
    autoUpdater.on('checking-for-update', () => {
      logger.info('[AutoUpdater] Vérification des mises à jour...')
      this.sendToRenderer('update-checking')
    })

    // Mise à jour disponible
    autoUpdater.on('update-available', (info) => {
      logger.info('[AutoUpdater] Mise à jour disponible:', info.version)
      this.sendToRenderer('update-available', {
        version: info.version,
        releaseNotes: info.releaseNotes,
        releaseDate: info.releaseDate,
        files: info.files
      })
    })

    // Aucune mise à jour disponible
    autoUpdater.on('update-not-available', (info) => {
      logger.info('[AutoUpdater] Application à jour (version:', info.version + ')')
      this.sendToRenderer('update-not-available', {
        version: info.version
      })
    })

    // Erreur lors de la vérification/téléchargement
    autoUpdater.on('error', (error) => {
      logger.error('[AutoUpdater] Erreur:', error)
      this.sendToRenderer('update-error', {
        message: error.message
      })
    })

    // Progression du téléchargement
    autoUpdater.on('download-progress', (progressObj) => {
      logger.info(
        `[AutoUpdater] Téléchargement: ${progressObj.percent.toFixed(2)}% (${progressObj.transferred}/${progressObj.total})`
      )
      this.sendToRenderer('download-progress', {
        percent: progressObj.percent,
        bytesPerSecond: progressObj.bytesPerSecond,
        transferred: progressObj.transferred,
        total: progressObj.total
      })
    })

    // Téléchargement terminé
    autoUpdater.on('update-downloaded', (info) => {
      logger.info('[AutoUpdater] Mise à jour téléchargée:', info.version)
      this.sendToRenderer('update-downloaded', {
        version: info.version,
        releaseNotes: info.releaseNotes,
        releaseDate: info.releaseDate
      })
    })
  }

  /**
   * Envoie un message au renderer process
   */
  private sendToRenderer(channel: string, data?: unknown): void {
    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      this.mainWindow.webContents.send(`updater:${channel}`, data)
    }
  }

  /**
   * Démarre la vérification automatique des mises à jour
   * (uniquement en production, après un délai de 10 secondes)
   * En dev: utilisez ENABLE_AUTO_UPDATE=true pour tester
   */
  public startUpdateCheck(): void {
    const isDev = process.env.NODE_ENV === 'development'
    const forceEnable = process.env.ENABLE_AUTO_UPDATE === 'true'

    if (isDev && !forceEnable) {
      logger.info('[AutoUpdater] Mode développement - mise à jour désactivée')
      logger.info('[AutoUpdater] Pour tester: ENABLE_AUTO_UPDATE=true npm run dev')
      return
    }

    // En dev avec ENABLE_AUTO_UPDATE, vérifier immédiatement pour faciliter les tests
    const delay = isDev ? 2000 : 10000

    // Attendre quelques secondes après le démarrage
    this.updateCheckTimeout = setTimeout(() => {
      logger.info('[AutoUpdater] Démarrage de la vérification des mises à jour')
      if (isDev) {
        logger.warn('[AutoUpdater] ⚠️ MODE TEST - Auto-update activé en développement')
      }
      this.checkForUpdates()
    }, delay)
  }

  /**
   * Vérifie manuellement les mises à jour
   */
  public async checkForUpdates(): Promise<void> {
    try {
      await autoUpdater.checkForUpdates()
    } catch (error) {
      logger.error('[AutoUpdater] Erreur lors de la vérification:', error)
      this.sendToRenderer('update-error', {
        message: error instanceof Error ? error.message : 'Erreur inconnue'
      })
    }
  }

  /**
   * Démarre le téléchargement de la mise à jour
   */
  public async downloadUpdate(): Promise<void> {
    try {
      logger.info('[AutoUpdater] Démarrage du téléchargement')
      await autoUpdater.downloadUpdate()
    } catch (error) {
      logger.error('[AutoUpdater] Erreur lors du téléchargement:', error)
      this.sendToRenderer('update-error', {
        message: error instanceof Error ? error.message : 'Erreur de téléchargement'
      })
    }
  }

  /**
   * Quitte l'application et installe la mise à jour
   */
  public quitAndInstall(): void {
    logger.info('[AutoUpdater] Installation de la mise à jour')
    autoUpdater.quitAndInstall(false, true)
  }

  /**
   * Nettoie les ressources
   */
  public cleanup(): void {
    if (this.updateCheckTimeout) {
      clearTimeout(this.updateCheckTimeout)
      this.updateCheckTimeout = null
    }
    this.mainWindow = null
  }
}
