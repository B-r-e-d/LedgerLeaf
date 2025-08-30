import { NavLink, useLocation } from '@remix-run/react'
import useSubscriptionStore from '~/store/subscriptionStore'
import AddSubscriptionPopover from './AddSubscriptionPopover'

// biome-ignore lint/suspicious/noEmptyInterface: <explanation>
const Header = (): JSX.Element => {
  const { addSubscription } = useSubscriptionStore()

  const location = useLocation()
  const onDashboard = location.pathname.startsWith('/dashboard')

  return (
    <header className="p-4 shadow-md bg-muted">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">LedgerLeaf</h1>
          <p className="text-sm text-muted-foreground">Track and manage recurring subscriptions.</p>
        </div>
        <div className="flex items-center gap-3">
          {onDashboard ? (
            <NavLink
              to="/"
              prefetch="intent"
              className={({ isActive }: { isActive: boolean }) =>
                [
                  'px-3 py-2 text-sm font-medium transition-colors rounded-md',
                  isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
                ].join(' ')
              }
              aria-label="Go to Home"
            >
              Home
            </NavLink>
          ) : (
            <NavLink
              to="/dashboard"
              prefetch="intent"
              className={({ isActive }: { isActive: boolean }) =>
                [
                  'px-3 py-2 text-sm font-medium transition-colors rounded-md',
                  isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
                ].join(' ')
              }
              aria-label="Go to Dashboard"
            >
              Dashboard
            </NavLink>
          )}

          <AddSubscriptionPopover addSubscription={addSubscription} />
        </div>
      </div>
    </header>
  )
}

export default Header
