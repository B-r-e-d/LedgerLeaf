import type { ChartData, Chart as ChartJS, ChartOptions, ChartType } from 'chart.js'
import { useEffect, useRef } from 'react'

type AnyChartType = Extract<ChartType, 'pie' | 'bar'>

type ClientChartProps<T extends AnyChartType> = {
  type: T
  data: ChartData<T>
  options?: ChartOptions<T>
  className?: string
}

export default function ClientChart<T extends AnyChartType>(props: ClientChartProps<T>) {
  const { type, data, options, className } = props
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const chartRef = useRef<ChartJS<any, any, any> | null>(null)

  useEffect(() => {
    let isMounted = true

    async function loadAndRender() {
      const mod = await import('chart.js/auto')
      if (!isMounted) return
      const ChartAuto = mod.default

      const ctx = canvasRef.current?.getContext('2d')
      if (!ctx) return

      // Merge maintainAspectRatio to false unless explicitly provided (use assign to satisfy deep generic)
      const mergedOptions = Object.assign({ maintainAspectRatio: false } as any, options) as ChartOptions<T>

      chartRef.current = new ChartAuto(ctx, {
        type,
        data,
        options: mergedOptions,
      })
    }

    loadAndRender()

    return () => {
      isMounted = false
      if (chartRef.current) {
        chartRef.current.destroy()
        chartRef.current = null
      }
    }
    // re-create only when data/options/type identity changes
  }, [type, data, options])

  return <canvas ref={canvasRef} className={className} role="img" aria-label="chart" />
}
