import { useState, useEffect, useCallback } from 'react'
import type { UpdateInfo, DownloadProgress } from '../../../preload/index.d'

export type UpdateStatus =
  | 'idle'
  | 'checking'
  | 'available'
  | 'not-available'
  | 'downloading'
  | 'downloaded'
  | 'error'

export interface UpdateState {
  status: UpdateStatus
  updateInfo: UpdateInfo | null
  downloadProgress: DownloadProgress | null
  error: string | null
}

export function useUpdater(): UpdateState & {
  checkForUpdates: () => Promise<void>
  downloadUpdate: () => Promise<void>
  installUpdate: () => Promise<void>
  resetState: () => void
} {
  const [state, setState] = useState<UpdateState>({
    status: 'idle',
    updateInfo: null,
    downloadProgress: null,
    error: null
  })

  // Vérifier les mises à jour
  const checkForUpdates = useCallback(async () => {
    try {
      await window.updater.checkForUpdates()
    } catch (error) {
      console.error('[useUpdater] Erreur lors de la vérification:', error)
      setState((prev) => ({
        ...prev,
        status: 'error',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      }))
    }
  }, [])

  // Télécharger la mise à jour
  const downloadUpdate = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, status: 'downloading', downloadProgress: null }))
      await window.updater.downloadUpdate()
    } catch (error) {
      console.error('[useUpdater] Erreur lors du téléchargement:', error)
      setState((prev) => ({
        ...prev,
        status: 'error',
        error: error instanceof Error ? error.message : 'Erreur de téléchargement'
      }))
    }
  }, [])

  // Installer la mise à jour
  const installUpdate = useCallback(async () => {
    try {
      await window.updater.quitAndInstall()
    } catch (error) {
      console.error("[useUpdater] Erreur lors de l'installation:", error)
      setState((prev) => ({
        ...prev,
        status: 'error',
        error: error instanceof Error ? error.message : "Erreur d'installation"
      }))
    }
  }, [])

  // Réinitialiser l'état
  const resetState = useCallback(() => {
    setState({
      status: 'idle',
      updateInfo: null,
      downloadProgress: null,
      error: null
    })
  }, [])

  useEffect(() => {
    // Vérification en cours
    const unsubChecking = window.updater.onUpdateChecking(() => {
      setState((prev) => ({ ...prev, status: 'checking', error: null }))
    })

    // Mise à jour disponible
    const unsubAvailable = window.updater.onUpdateAvailable((info) => {
      setState((prev) => ({
        ...prev,
        status: 'available',
        updateInfo: info as UpdateInfo,
        error: null
      }))
    })

    // Pas de mise à jour
    const unsubNotAvailable = window.updater.onUpdateNotAvailable(() => {
      setState((prev) => ({ ...prev, status: 'not-available', error: null }))
    })

    // Erreur
    const unsubError = window.updater.onUpdateError((error) => {
      const errorData = error as { message: string }
      setState((prev) => ({
        ...prev,
        status: 'error',
        error: errorData.message || 'Erreur inconnue'
      }))
    })

    // Progression du téléchargement
    const unsubProgress = window.updater.onDownloadProgress((progress) => {
      setState((prev) => ({
        ...prev,
        status: 'downloading',
        downloadProgress: progress as DownloadProgress
      }))
    })

    // Téléchargement terminé
    const unsubDownloaded = window.updater.onUpdateDownloaded((info) => {
      setState((prev) => ({
        ...prev,
        status: 'downloaded',
        updateInfo: info as UpdateInfo,
        downloadProgress: null
      }))
    })

    // Cleanup
    return () => {
      unsubChecking()
      unsubAvailable()
      unsubNotAvailable()
      unsubError()
      unsubProgress()
      unsubDownloaded()
    }
  }, [])

  return {
    ...state,
    checkForUpdates,
    downloadUpdate,
    installUpdate,
    resetState
  }
}
