import { ipcMain } from 'electron'
import type { IUpdater } from '../updater/IUpdater'

/**
 * Enregistre les handlers IPC pour le système de mise à jour
 */
export function registerUpdaterHandlers(appUpdater: IUpdater): void {
  // Vérifier manuellement les mises à jour
  ipcMain.handle('updater:check-for-updates', async () => {
    await appUpdater.checkForUpdates()
    return { success: true }
  })

  // Télécharger la mise à jour
  ipcMain.handle('updater:download-update', async () => {
    await appUpdater.downloadUpdate()
    return { success: true }
  })

  // Installer la mise à jour maintenant
  ipcMain.handle('updater:quit-and-install', () => {
    appUpdater.quitAndInstall()
    return { success: true }
  })
}
