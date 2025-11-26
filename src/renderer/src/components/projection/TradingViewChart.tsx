import React, { useEffect, useRef } from 'react'
import { createChart, LineStyle, LineSeries } from 'lightweight-charts'
import type { IChartApi } from 'lightweight-charts'
import type { ProjectionChartData } from '@renderer/types/projection'

interface TradingViewChartProps {
  data: ProjectionChartData
  height?: number
  realityColor?: string
  realityTitle?: string
  objectiveColor?: string
  objectiveTitle?: string
  objectiveStyle?: 'solid' | 'dashed'
}

/**
 * Graphique TradingView avec 2 courbes (réalité + objectif)
 */
function TradingViewChart({
  data,
  height = 400,
  realityColor = '#10b981',
  realityTitle = 'Patrimoine Réel',
  objectiveColor = '#3b82f6',
  objectiveTitle = 'Objectif Théorique',
  objectiveStyle = 'dashed'
}: TradingViewChartProps): React.JSX.Element {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)

  useEffect(() => {
    if (!chartContainerRef.current) return

    // Créer le graphique
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height,
      layout: {
        background: { color: '#ffffff' },
        textColor: '#333'
      },
      grid: {
        vertLines: { color: '#f0f0f0' },
        horzLines: { color: '#f0f0f0' }
      },
      crosshair: {
        mode: 1,
        vertLine: {
          width: 1,
          color: '#9B9B9B',
          style: LineStyle.Dashed
        },
        horzLine: {
          width: 1,
          color: '#9B9B9B',
          style: LineStyle.Dashed
        }
      },
      timeScale: {
        borderColor: '#D1D4DC',
        timeVisible: true,
        secondsVisible: false,
        rightOffset: 5,
        barSpacing: 10,
        fixLeftEdge: true,
        fixRightEdge: true
      },
      rightPriceScale: {
        borderColor: '#D1D4DC',
        scaleMargins: {
          top: 0.1,
          bottom: 0.1
        }
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
        horzTouchDrag: true,
        vertTouchDrag: false
      },
      handleScale: {
        axisPressedMouseMove: false,
        mouseWheel: false,
        pinch: false
      }
    })

    chartRef.current = chart

    // Ligne 1 : Première série (par défaut patrimoine réel)
    const realitySeries = chart.addSeries(LineSeries, {
      color: realityColor,
      lineWidth: 2,
      title: realityTitle,
      priceFormat: {
        type: 'price',
        precision: 0,
        minMove: 1
      }
    })

    // Ligne 2 : Deuxième série (par défaut objectif théorique)
    const objectiveSeries = chart.addSeries(LineSeries, {
      color: objectiveColor,
      lineWidth: 2,
      lineStyle: objectiveStyle === 'dashed' ? LineStyle.Dashed : LineStyle.Solid,
      title: objectiveTitle,
      priceFormat: {
        type: 'price',
        precision: 0,
        minMove: 1
      }
    })

    // Définir les données
    realitySeries.setData(data.realityData)
    objectiveSeries.setData(data.objectiveData)

    // Auto-fit
    chart.timeScale().fitContent()

    // Responsive
    const handleResize = (): void => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth
        })
      }
    }

    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      chart.remove()
    }
  }, [data, height, realityColor, realityTitle, objectiveColor, objectiveTitle, objectiveStyle])

  return (
    <div ref={chartContainerRef} className="relative w-full" style={{ height: `${height}px` }} />
  )
}

export default TradingViewChart
