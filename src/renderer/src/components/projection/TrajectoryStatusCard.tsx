import React from 'react'
import type { TrajectoryStatus } from './hooks/useProjectionInsights'

interface TrajectoryStatusCardProps {
  status: TrajectoryStatus
}

/**
 * Carte affichant le statut de la trajectoire avec une description détaillée
 */
function TrajectoryStatusCard({ status }: TrajectoryStatusCardProps): React.JSX.Element {
  return (
    <div className={`rounded-lg border-2 p-4 ${status.bgColor}`}>
      <div className="mb-2 flex items-center gap-2">
        <span className="text-2xl">{status.icon}</span>
        <h4 className={`text-lg font-bold ${status.color}`}>{status.title}</h4>
      </div>
      <p className="text-sm leading-relaxed text-gray-700">{status.description}</p>
    </div>
  )
}

export default TrajectoryStatusCard
