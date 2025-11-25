import { TrendingUp, TrendingDown, DollarSign, Wallet, PiggyBank, Target } from 'lucide-react'

interface KPICardProps {
  title: string
  value: string
  subtitle?: string
  icon: 'wallet' | 'dollar' | 'piggy' | 'target' | 'up' | 'down'
  trend?: 'positive' | 'negative' | 'neutral'
  percentage?: string
}

function KPICard({
  title,
  value,
  subtitle,
  icon,
  trend,
  percentage
}: KPICardProps): React.JSX.Element {
  const getIcon = (): React.JSX.Element => {
    const iconProps = { size: 24, strokeWidth: 2 }

    switch (icon) {
      case 'wallet':
        return <Wallet {...iconProps} />
      case 'dollar':
        return <DollarSign {...iconProps} />
      case 'piggy':
        return <PiggyBank {...iconProps} />
      case 'target':
        return <Target {...iconProps} />
      case 'up':
        return <TrendingUp {...iconProps} />
      case 'down':
        return <TrendingDown {...iconProps} />
    }
  }

  const getTrendColor = (): string => {
    if (!trend) return 'var(--color-primary)'
    switch (trend) {
      case 'positive':
        return '#10b981'
      case 'negative':
        return '#ef4444'
      case 'neutral':
        return '#6b7280'
    }
  }

  const iconColor = getTrendColor()

  return (
    <div
      style={{
        background: 'var(--color-card-bg)',
        borderRadius: 'var(--border-radius)',
        padding: 'var(--spacing-lg)',
        border: '1px solid var(--color-border)',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.12)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Icon Background Decoration */}
      <div
        style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          width: '100px',
          height: '100px',
          background: `${iconColor}15`,
          borderRadius: '50%',
          pointerEvents: 'none'
        }}
      />

      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 'var(--spacing-md)',
          position: 'relative'
        }}
      >
        <span
          style={{
            fontSize: '13px',
            fontWeight: '500',
            color: 'var(--color-text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}
        >
          {title}
        </span>
        <div
          style={{
            padding: '8px',
            borderRadius: '8px',
            background: `${iconColor}20`,
            color: iconColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {getIcon()}
        </div>
      </div>

      {/* Value */}
      <div
        style={{
          fontSize: '28px',
          fontWeight: '700',
          color: 'var(--color-text-primary)',
          marginBottom: subtitle || percentage ? 'var(--spacing-xs)' : '0',
          position: 'relative'
        }}
      >
        {value}
      </div>

      {/* Subtitle or Percentage */}
      {(subtitle || percentage) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-xs)'
          }}
        >
          {percentage && (
            <span
              style={{
                fontSize: '14px',
                fontWeight: '600',
                color: iconColor,
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              {trend === 'positive' && <TrendingUp size={16} />}
              {trend === 'negative' && <TrendingDown size={16} />}
              {percentage}
            </span>
          )}
          {subtitle && (
            <span
              style={{
                fontSize: '13px',
                color: 'var(--color-text-secondary)'
              }}
            >
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default KPICard
