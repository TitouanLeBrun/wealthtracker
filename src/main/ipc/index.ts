import { registerTransactionHandlers } from './transactions'
import { registerCategoryHandlers } from './categories'
import { registerAssetHandlers } from './assets'
import { registerObjectiveHandlers } from './objectives'
import { registerImportHandlers } from './import'
import { registerUpdaterHandlers } from './updater'
import type { IUpdater } from '../updater/IUpdater'

/**
 * Enregistre tous les handlers IPC pour l'application
 */
export function registerAllIpcHandlers(appUpdater?: IUpdater): void {
  registerTransactionHandlers()
  registerCategoryHandlers()
  registerAssetHandlers()
  registerObjectiveHandlers()
  registerImportHandlers()

  // Enregistrer les handlers de mise à jour (en production ou si MockUpdater en dev)
  if (appUpdater) {
    registerUpdaterHandlers(appUpdater)
  }
}
