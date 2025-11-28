/**
 * Interface commune pour AppUpdater et MockUpdater
 * Permet de tester l'UI sans vraie release GitHub
 */
export interface IUpdater {
  startUpdateCheck(): void
  checkForUpdates(): Promise<void>
  downloadUpdate(): Promise<void>
  quitAndInstall(): void
  cleanup(): void
}
