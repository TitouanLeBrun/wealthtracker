import { registerTransactionHandlers } from './transactions'
import { registerCategoryHandlers } from './categories'
import { registerAssetHandlers } from './assets'
import { registerObjectiveHandlers } from './objectives'

/**
 * Enregistre tous les handlers IPC pour l'application
 */
export function registerAllIpcHandlers(): void {
  registerTransactionHandlers()
  registerCategoryHandlers()
  registerAssetHandlers()
  registerObjectiveHandlers()
}
