import type { DownloadProgress } from '../../../../preload/index.d'

interface DownloadProgressProps {
  progress: DownloadProgress
}

export function DownloadProgressComponent({ progress }: DownloadProgressProps): React.JSX.Element {
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
  }

  const formatSpeed = (bytesPerSecond: number): string => {
    return `${formatBytes(bytesPerSecond)}/s`
  }

  const percent = Math.round(progress.percent)

  return (
    <div className="download-progress-container">
      <div className="download-progress-header">
        <h3 className="download-progress-title">⬇️ Téléchargement en cours...</h3>
        <span className="download-progress-percent">{percent}%</span>
      </div>

      <div className="progress-bar-container">
        <div className="progress-bar-background">
          <div className="progress-bar-fill" style={{ width: `${percent}%` }}>
            <div className="progress-bar-shimmer" />
          </div>
        </div>
      </div>

      <div className="download-progress-stats">
        <span className="download-stat">
          {formatBytes(progress.transferred)} / {formatBytes(progress.total)}
        </span>
        <span className="download-stat">{formatSpeed(progress.bytesPerSecond)}</span>
      </div>

      <p className="download-progress-hint">
        Le téléchargement se poursuit en arrière-plan. Vous pouvez continuer à utiliser
        l&apos;application.
      </p>
    </div>
  )
}
