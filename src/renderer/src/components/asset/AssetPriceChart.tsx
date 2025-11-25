import { useEffect, useRef, useState } from 'react'
import { createChart, IChartApi, ISeriesApi, LineData, LineSeries } from 'lightweight-charts'
import type { Transaction } from '../../types'
import {
  generatePriceHistory,
  TimeRange,
  getRangeLabel,
  calculatePriceChange
} from '../../utils/mockPriceData'

interface AssetPriceChartProps {
  currentPrice: number
  categoryColor: string
  transactions: Transaction[]
}

function AssetPriceChart({
  currentPrice,
  categoryColor,
  transactions
}: AssetPriceChartProps): React.JSX.Element {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const seriesRef = useRef<ISeriesApi<'Line'> | null>(null)
  const [selectedRange, setSelectedRange] = useState<TimeRange>('1M')

  const ranges: TimeRange[] = ['1D', '5D', '1M', '6M', '1Y', '5Y']

  // Générer les données pour la période sélectionnée
  const priceData = generatePriceHistory(currentPrice, selectedRange, transactions)
  const priceChange = calculatePriceChange(priceData)

  // Initialiser le graphique
  useEffect(() => {
    if (!chartContainerRef.current) return

    // Créer le graphique
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth - 16, // Soustraire le padding (2 * 8px)
      height: window.innerWidth <= 768 ? 300 : 400,
      layout: {
        background: { color: '#ffffff' },
        textColor: '#333'
      },
      grid: {
        vertLines: { color: '#f0f0f0' },
        horzLines: { color: '#f0f0f0' }
      },
      rightPriceScale: {
        borderColor: '#e0e0e0'
      },
      timeScale: {
        borderColor: '#e0e0e0',
        timeVisible: true,
        secondsVisible: false
      },
      crosshair: {
        mode: 1
      }
    })

    // Créer la série de ligne
    const lineSeries = chart.addSeries(LineSeries)

    // Appliquer les options de style
    lineSeries.applyOptions({
      color: categoryColor,
      lineWidth: 2,
      priceFormat: {
        type: 'price',
        precision: 2,
        minMove: 0.01
      }
    })

    chartRef.current = chart
    seriesRef.current = lineSeries

    // Gérer le redimensionnement
    const handleResize = (): void => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth - 16, // Soustraire le padding (2 * 8px)
          height: window.innerWidth <= 768 ? 300 : 400
        })
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chart.remove()
    }
  }, [categoryColor])

  // Mettre à jour les données quand la période change
  useEffect(() => {
    if (seriesRef.current && priceData.length > 0) {
      seriesRef.current.setData(priceData as LineData[])
      chartRef.current?.timeScale().fitContent()
    }
  }, [priceData])

  return (
    <div style={{ width: '100%' }}>
      {/* En-tête avec variation de prix */}
      <div
        style={{
          marginBottom: 'var(--spacing-md)',
          padding: 'var(--spacing-md)',
          background: 'var(--color-card-bg)',
          borderRadius: '8px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
          <span style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
            Variation sur {getRangeLabel(selectedRange)}
          </span>
          <span
            style={{
              fontSize: '18px',
              fontWeight: '700',
              color: priceChange.percentage >= 0 ? '#10b981' : '#ef4444'
            }}
          >
            {priceChange.percentage >= 0 ? '+' : ''}
            {priceChange.absolute.toFixed(2)} € ({priceChange.percentage.toFixed(2)}%)
          </span>
        </div>
      </div>

      {/* Conteneur du graphique */}
      <div
        ref={chartContainerRef}
        style={{
          background: 'white',
          borderRadius: '8px',
          padding: 'var(--spacing-sm)',
          border: '1px solid #e5e7eb',
          marginBottom: 'var(--spacing-md)',
          width: '100%',
          boxSizing: 'border-box'
        }}
      />

      {/* Sélecteur de période */}
      <div
        style={{
          display: 'flex',
          gap: 'var(--spacing-xs)',
          width: '100%'
        }}
      >
        {ranges.map((range) => (
          <button
            key={range}
            onClick={() => setSelectedRange(range)}
            style={{
              flex: 1,
              padding: '8px 16px',
              background: selectedRange === range ? categoryColor : 'white',
              color: selectedRange === range ? 'white' : '#374151',
              border: selectedRange === range ? 'none' : '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow:
                selectedRange === range
                  ? `0 2px 8px ${categoryColor}40`
                  : '0 1px 2px rgba(0,0,0,0.05)'
            }}
            onMouseEnter={(e) => {
              if (selectedRange !== range) {
                e.currentTarget.style.background = '#f9fafb'
                e.currentTarget.style.borderColor = '#d1d5db'
              }
            }}
            onMouseLeave={(e) => {
              if (selectedRange !== range) {
                e.currentTarget.style.background = 'white'
                e.currentTarget.style.borderColor = '#e5e7eb'
              }
            }}
          >
            {range}
          </button>
        ))}
      </div>
    </div>
  )
}

export default AssetPriceChart
