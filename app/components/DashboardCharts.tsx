import { useLoaderData } from '@remix-run/react'
import * as React from 'react'
import ClientChart from '~/components/charts/ClientChart'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import type { loader as dashboardLoader } from '~/routes/dashboard'
import { usePreferencesStore } from '~/stores/preferences'

function lastSixMonthLabels(): string[] {
  const labels: string[] = []
  const ref = new Date()
  for (let i = 5; i >= 0; i--) {
    const d = new Date(ref.getFullYear(), ref.getMonth() - i, 1)
    const label = d.toLocaleString('en-US', { month: 'short', year: '2-digit' })
    labels.push(label)
  }
  return labels
}

export default function DashboardCharts() {
  // Access rates from the dashboard route loader (type-only import avoids runtime cycle)
  const { rates } = useLoaderData<typeof dashboardLoader>()
  const { selectedCurrency } = usePreferencesStore()

  // Mock base data is in INR
  const subscriptionData = [
    { name: 'Netflix', amount: 649 },
    { name: 'Spotify', amount: 119 },
    { name: 'Adobe CC', amount: 1599 },
    { name: 'GitHub', amount: 400 },
    { name: 'Google One', amount: 650 },
  ]

  // Compute conversion factor from INR -> selectedCurrency using USD-based rates:
  // valueInSelected = valueInINR * (rate[selected] / rate[INR])
  const conversionFactor = React.useMemo(() => {
    if (!rates) return 1
    const inr = rates['INR']
    const target = rates[selectedCurrency] || 1
    if (!inr || !target) return 1
    return target / inr
  }, [rates, selectedCurrency])

  const formatCurrency = React.useCallback(
    (value: number) => {
      try {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: selectedCurrency,
          maximumFractionDigits: 0,
        }).format(value)
      } catch {
        // Fallback with ISO code prefix
        return `${selectedCurrency} ${value}`
      }
    },
    [selectedCurrency],
  )

  const pieLabels = subscriptionData.map((s) => s.name)
  const pieValuesConverted = subscriptionData.map((s) => s.amount * conversionFactor)

  const pieData = {
    labels: pieLabels,
    datasets: [
      {
        label: 'Monthly Expense',
        data: pieValuesConverted,
        backgroundColor: ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'],
        hoverOffset: 8,
      },
    ],
  }

  const pieOptions = {
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: { boxWidth: 16, boxHeight: 16 },
      },
      tooltip: {
        callbacks: {
          label: (ctx: any) => {
            const raw = Number(ctx.parsed)
            return `${ctx.label}: ${formatCurrency(raw)}`
          },
        },
      },
    },
  }

  // Mock: last 6 months totals (base INR), then convert
  const barLabels = lastSixMonthLabels()
  const barValuesINR = [4200, 4380, 4120, 4590, 4720, 4610]
  const barValuesConverted = barValuesINR.map((v) => v * conversionFactor)

  const barData = {
    labels: barLabels,
    datasets: [
      {
        label: 'Total per month',
        data: barValuesConverted,
        backgroundColor: '#3b82f6',
        borderRadius: 6,
        barPercentage: 0.6,
        categoryPercentage: 0.6,
      },
    ],
  }

  const barOptions = {
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: any) => {
            const raw = Number(ctx.parsed.y)
            return ` ${formatCurrency(raw)}`
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(148, 163, 184, 0.2)' },
        ticks: {
          callback: (value: string | number) => {
            const n = Number(value)
            return formatCurrency(n)
          },
        },
      },
      x: {
        grid: { display: false },
      },
    },
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <Card className="h-[380px]">
        <CardHeader>
          <CardTitle>Monthly expenses by subscription</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ClientChart type="pie" data={pieData as any} options={pieOptions as any} className="h-full w-full" />
        </CardContent>
      </Card>

      <Card className="h-[380px]">
        <CardHeader>
          <CardTitle>Total cost per month (last 6 months)</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ClientChart type="bar" data={barData as any} options={barOptions as any} className="h-full w-full" />
        </CardContent>
      </Card>
    </div>
  )
}
