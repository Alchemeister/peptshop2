import { Check, ChevronUp, Copy, Moon, Route, Sun, X } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import type { FrontendTheme, PeptShopActions, PeptShopViewModels } from './contracts'
import { mockModels } from './mock-data'
import { ApiDocsPage, ContentPage, LibraryPage } from './pages/content-pages'
import { CommercePage, OrderFlowPage } from './pages/commerce-pages'
import { EvidencePage } from './pages/evidence-pages'
import { HomePage } from './pages/home-page'
import { CatalogPage, ProductPage, VendorPage, VendorsPage } from './pages/market-pages'
import { AdminPage, AffiliatePage, AuthPage, SellerPage, StaffPage } from './pages/portal-pages'
import { previewRoutes, resolveRoute, routeManifest } from './route-manifest'
import { StorefrontShell } from './shell'

export type PeptShopFrontendProps = {
  actions?: Partial<PeptShopActions>
  initialPath?: string
  models?: PeptShopViewModels
  showPreviewTools?: boolean
  theme?: FrontendTheme
}

const readLocation = () => {
  if (typeof window === 'undefined') return { pathname: '/', query: new URLSearchParams() }
  return { pathname: window.location.pathname, query: new URLSearchParams(window.location.search) }
}

export function PeptShopFrontend({
  actions: providedActions,
  initialPath,
  models = mockModels,
  showPreviewTools = false,
  theme: providedTheme,
}: PeptShopFrontendProps) {
  const [{ pathname, query }, setLocation] = useState(() => {
    if (initialPath) {
      const [path, search = ''] = initialPath.split('?')
      return { pathname: path || '/', query: new URLSearchParams(search) }
    }
    return readLocation()
  })
  const [theme, setTheme] = useState<FrontendTheme>(providedTheme ?? 'light')
  const [previewOpen, setPreviewOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [cartCount, setCartCount] = useState(() => models.cart.reduce((sum, line) => sum + line.quantity, 0))

  useEffect(() => {
    const onPopState = () => setLocation(readLocation())
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    if (!toast) return
    const timeout = window.setTimeout(() => setToast(null), 2600)
    return () => window.clearTimeout(timeout)
  }, [toast])

  const navigate = useCallback((href: string) => {
    const target = new URL(href, window.location.origin)
    window.history.pushState({}, '', `${target.pathname}${target.search}${target.hash}`)
    setLocation({ pathname: target.pathname, query: target.searchParams })
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  const demo = useCallback((message: string) => setToast(message), [])

  const actions = useMemo<PeptShopActions>(() => ({
    navigate,
    searchProducts: (searchQuery) => navigate(`/products?q=${encodeURIComponent(searchQuery)}`),
    addToCart: () => { setCartCount((count) => count + 1); demo('Added to the preview cart') },
    updateCartQuantity: () => demo('Quantity change sent to the private adapter'),
    removeCartLine: () => demo('Remove action sent to the private adapter'),
    beginCheckout: () => undefined,
    submitCheckout: () => demo('Checkout submitted to the private adapter'),
    submitEmail: () => demo('Email action sent to the private adapter'),
    submitLogin: () => undefined,
    submitCoa: () => undefined,
    verifyBatch: () => undefined,
    createVendor: () => undefined,
    sellerAction: (action) => demo(`Seller action: ${action}`),
    adminAction: (action) => demo(`Admin action: ${action}`),
    ...providedActions,
  }), [demo, navigate, providedActions])

  const route = resolveRoute(pathname)
  const pageProps = { actions, models, pathname, query, theme }
  const isPortal = ['seller', 'admin', 'staff', 'affiliate'].includes(route.family)
  const page = renderPage(route.family, pageProps)

  return (
    <>
      {isPortal || route.family === 'api' ? (
        <div className="ps-app" data-theme={theme}>{page}</div>
      ) : (
        <StorefrontShell actions={actions} cartCount={cartCount} pathname={pathname} theme={theme}>
          {page}
        </StorefrontShell>
      )}

      {showPreviewTools ? (
        <PreviewTools
          currentPath={pathname}
          navigate={navigate}
          open={previewOpen}
          setOpen={setPreviewOpen}
          theme={theme}
          setTheme={setTheme}
        />
      ) : null}

      {toast ? <div className="ps-preview-toast" role="status"><Check size={16} /> {toast}</div> : null}
    </>
  )
}

function renderPage(family: ReturnType<typeof resolveRoute>['family'], props: Parameters<typeof HomePage>[0]) {
  switch (family) {
    case 'home': return <HomePage {...props} />
    case 'catalog': return <CatalogPage {...props} />
    case 'product': return <ProductPage {...props} />
    case 'vendors': return <VendorsPage {...props} />
    case 'vendor': return <VendorPage {...props} />
    case 'evidence': return <EvidencePage {...props} />
    case 'commerce': return <CommercePage {...props} />
    case 'orders': return <OrderFlowPage {...props} />
    case 'content': return <ContentPage {...props} />
    case 'library': return <LibraryPage {...props} />
    case 'auth': return <AuthPage {...props} />
    case 'seller': return <SellerPage {...props} />
    case 'admin': return <AdminPage {...props} />
    case 'staff': return <StaffPage {...props} />
    case 'affiliate': return <AffiliatePage {...props} />
    case 'api': return <ApiDocsPage />
  }
}

function PreviewTools({
  currentPath,
  navigate,
  open,
  setOpen,
  theme,
  setTheme,
}: {
  currentPath: string
  navigate: (href: string) => void
  open: boolean
  setOpen: (value: boolean) => void
  theme: FrontendTheme
  setTheme: (theme: FrontendTheme) => void
}) {
  const [copied, setCopied] = useState(false)
  return (
    <aside className="ps-preview-tools" data-open={open}>
      <button type="button" className="ps-preview-tools-toggle" onClick={() => setOpen(!open)} aria-expanded={open}>
        <Route size={17} /> Page explorer <ChevronUp size={15} />
      </button>
      {open ? (
        <div className="ps-preview-tools-panel">
          <header><div><strong>PeptShop frontend</strong><span>Mock data only</span></div><button type="button" onClick={() => setOpen(false)} aria-label="Close page explorer"><X size={17} /></button></header>
          <div className="ps-preview-current"><span>Current route</span><code>{currentPath}</code><button type="button" onClick={async () => { await navigator.clipboard?.writeText(currentPath); setCopied(true); window.setTimeout(() => setCopied(false), 1400) }} aria-label="Copy current route">{copied ? <Check size={15} /> : <Copy size={15} />}</button></div>
          <div className="ps-preview-theme"><span>Theme</span><button type="button" aria-pressed={theme === 'light'} onClick={() => setTheme('light')}><Sun size={15} /> Light</button><button type="button" aria-pressed={theme === 'dark'} onClick={() => setTheme('dark')}><Moon size={15} /> Dark</button></div>
          <nav aria-label="Preview routes">
            {routeManifest.filter((entry) => entry.paths.some((path) => previewRoutes.includes(path as never))).map((entry) => {
              const href = entry.paths.find((path) => previewRoutes.includes(path as never)) ?? entry.paths[0]
              return <button key={`${entry.family}-${href}`} type="button" aria-current={resolveRoute(currentPath).label === entry.label ? 'page' : undefined} onClick={() => { navigate(href); setOpen(false) }}><span>{entry.access}</span>{entry.label}<code>{href}</code></button>
            })}
          </nav>
        </div>
      ) : null}
    </aside>
  )
}

export default function App() {
  return <PeptShopFrontend />
}
