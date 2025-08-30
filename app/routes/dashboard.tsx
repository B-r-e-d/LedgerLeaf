import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import DashboardCharts from '~/components/DashboardCharts'
import Header from '~/components/Header'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { getCacheHeaders, getCurrencyRates } from '~/services/currency.server'
import { usePreferencesStore } from '~/stores/preferences'

export const meta: MetaFunction = () => {
  return [
    { title: 'Dashboard | Subscriptions' },
    { name: 'description', content: 'Visualize subscription spending and monthly totals.' },
  ]
}

export async function loader({ request }: LoaderFunctionArgs) {
  const data = await getCurrencyRates()

  return json(
    {
      rates: data?.rates ?? null,
      lastUpdated: data?.date ?? null,
    },
    {
      headers: getCacheHeaders(data?.date),
    },
  )
}

export default function DashboardRoute() {
  const { rates } = useLoaderData<typeof loader>()
  const { selectedCurrency, setSelectedCurrency } = usePreferencesStore()

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-6 px-3 sm:px-4 lg:px-6">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-foreground mb-1">Dashboard</h2>
            <p className="text-sm text-muted-foreground">Visualize subscription spending and monthly totals</p>
          </div>
          {rates ? (
            <div className="flex items-center gap-2">
              <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                <SelectTrigger className="w-[96px]">
                  <SelectValue placeholder="Currency" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(rates).map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : null}
        </div>

        <DashboardCharts />
      </main>
    </div>
  )
}
