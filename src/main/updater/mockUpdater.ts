import { BrowserWindow } from 'electron'
import logger from 'electron-log'
import type { IUpdater } from './IUpdater'

/**
 * Mock Updater pour tester l'UI en développement
 * Simule les événements d'electron-updater sans vraie vérification
 */
export class MockUpdater implements IUpdater {
  private mainWindow: BrowserWindow | null = null

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow
  }

  private sendToRenderer(channel: string, data?: unknown): void {
    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      this.mainWindow.webContents.send(`updater:${channel}`, data)
    }
  }

  /**
   * Simule une vérification de mise à jour
   */
  public startUpdateCheck(): void {
    logger.info('[MockUpdater] 🎭 Mode SIMULATION - Test UI auto-update')

    setTimeout(() => {
      logger.info('[MockUpdater] Simulation: Vérification...')
      this.sendToRenderer('update-checking')

      // Simule une mise à jour disponible après 3 secondes
      setTimeout(() => {
        logger.info('[MockUpdater] Simulation: Mise à jour disponible')
        this.sendToRenderer('update-available', {
          version: '99.99.99', // Version fictive
          releaseNotes: `### 🎭 MODE SIMULATION

**Ceci est une mise à jour simulée pour tester l'interface.**

#### Nouveautés
- ✨ Test du système de notification
- 🎨 Vérification du design de la modal
- 📊 Test de la barre de progression`,
          releaseDate: new Date().toISOString()
        })
      }, 3000)
    }, 2000)
  }

  /**
   * Simule un téléchargement
   */
  public async downloadUpdate(): Promise<void> {
    logger.info('[MockUpdater] Simulation: Téléchargement...')

    // Simule une progression de 0 à 100%
    let percent = 0
    const interval = setInterval(() => {
      percent += 5

      this.sendToRenderer('download-progress', {
        percent,
        bytesPerSecond: 2500000, // 2.5 MB/s
        transferred: (percent / 100) * 120000000, // 120 MB total
        total: 120000000
      })

      if (percent >= 100) {
        clearInterval(interval)

        // Téléchargement terminé
        setTimeout(() => {
          logger.info('[MockUpdater] Simulation: Téléchargement terminé')
          this.sendToRenderer('update-downloaded', {
            version: '99.99.99',
            releaseNotes: 'Mise à jour simulée',
            releaseDate: new Date().toISOString()
          })
        }, 500)
      }
    }, 200) // Progression toutes les 200ms
  }

  /**
   * Simule l'installation (ne fait rien en réalité)
   */
  public quitAndInstall(): void {
    logger.info('[MockUpdater] Simulation: Installation (ne fait rien)')
    logger.warn("[MockUpdater] En production, l'app se fermerait ici")
  }

  public cleanup(): void {
    this.mainWindow = null
  }

  public async checkForUpdates(): Promise<void> {
    // Ne fait rien, la vérification est lancée automatiquement
  }
}
