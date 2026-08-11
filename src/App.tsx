import { Check, ChevronUp, Copy, Moon, Route, Sun, X } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import type { CartLine, FrontendTheme, PeptShopActions, PeptShopViewModels } from './contracts'
import { ErrorBoundary } from './error-boundary'
import { mockModels } from './mock-data'
import { CommercePage, OrderFlowPage } from './pages/commerce-pages'
import { ApiDocsPage, ContentPage, LibraryPage } from './pages/content-pages'
import { EvidencePage } from './pages/evidence-pages'
import { HomePage } from './pages/home-page'
import { CatalogPage, VendorPage, VendorsPage } from './pages/market-pages'
import { AdminPage, AffiliatePage, AuthPage, SellerPage, StaffPage } from './pages/portal-pages'
import { ProductMarketplacePage } from './pages/product-marketplace-page'
import {
  previewRoutes,
  type RouteFamily,
  resolveRoute,
  routeManifest,
} from './route-manifest'
import { PURGED_CSS } from './styles/purged-css'
import { StorefrontShell } from './shell'

export type FrontendNavigationMode = 'browser' | 'memory'
export type FrontendPreviewAction = Exclude<keyof PeptShopActions, 'navigate' | 'searchProducts'>

export type PeptShopFrontendProps = {
  actions?: Partial<PeptShopActions>
  allowedRouteFamilies?: readonly RouteFamily[]
  initialPath?: string
  models?: PeptShopViewModels
  navigationMode?: FrontendNavigationMode
  onPreviewAction?: (action: FrontendPreviewAction) => void
  requestedPath?: string
  showPreviewTools?: boolean
  theme?: FrontendTheme
}

const readLocation = (navigationMode: FrontendNavigationMode) => {
  if (navigationMode === 'memory' || typeof window === 'undefined') {
    return { pathname: '/', query: new URLSearchParams() }
  }
  return { pathname: window.location.pathname, query: new URLSearchParams(window.location.search) }
}

export function PeptShopFrontend({
  actions: providedActions,
  allowedRouteFamilies,
  initialPath,
  models = mockModels,
  navigationMode = 'browser',
  onPreviewAction,
  requestedPath,
  showPreviewTools = false,
  theme: providedTheme,
}: PeptShopFrontendProps) {
  const [{ pathname, query }, setLocation] = useState(() => {
    if (initialPath) {
      const [path, search = ''] = initialPath.split('?')
      return { pathname: path || '/', query: new URLSearchParams(search) }
    }
    return readLocation(navigationMode)
  })
  const [theme, setTheme] = useState<FrontendTheme>(providedTheme ?? 'light')
  const [previewOpen, setPreviewOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [cartLines, setCartLines] = useState<CartLine[]>(() => {
    try {
      const saved = localStorage.getItem('peptshop-cart')
      if (saved) return JSON.parse(saved)
    } catch { /* ignore */ }
    return models.cart ?? []
  })
  const [lastOrderTotal, setLastOrderTotal] = useState<number | null>(null)
  const cartCount = cartLines.reduce((sum, line) => sum + line.quantity, 0)

  useEffect(() => {
    try { localStorage.setItem('peptshop-cart', JSON.stringify(cartLines)) } catch { /* ignore */ }
  }, [cartLines])
  const allowedFamilies = useMemo(
    () => (allowedRouteFamilies ? new Set(allowedRouteFamilies) : null),
    [allowedRouteFamilies],
  )

  useEffect(() => {
    if (navigationMode === 'memory') return
    const onPopState = () => setLocation(readLocation(navigationMode))
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [navigationMode])

  useEffect(() => {
    if (!toast) return
    const timeout = window.setTimeout(() => setToast(null), 2600)
    return () => window.clearTimeout(timeout)
  }, [toast])

  const demo = useCallback((message: string) => setToast(message), [])

  const navigate = useCallback((href: string) => {
    const target = new URL(href, window.location.origin)
    if (allowedFamilies && !allowedFamilies.has(resolveRoute(target.pathname).family)) {
      demo('This route is outside the safe preview scope')
      return
    }
    if (navigationMode === 'browser') {
      window.history.pushState({}, '', `${target.pathname}${target.search}${target.hash}`)
      if (target.hash) window.dispatchEvent(new HashChangeEvent('hashchange'))
    }
    setLocation({ pathname: target.pathname, query: target.searchParams })
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [allowedFamilies, demo, navigationMode])

  useEffect(() => {
    if (requestedPath) navigate(requestedPath)
  }, [navigate, requestedPath])

  const previewAction = useCallback(
    (action: FrontendPreviewAction, message: string) => {
      demo(message)
      onPreviewAction?.(action)
    },
    [demo, onPreviewAction],
  )

  const actions = useMemo<PeptShopActions>(() => ({
    navigate,
    searchProducts: (searchQuery) => navigate(`/products?q=${encodeURIComponent(searchQuery)}`),
    addToCart: (productId: string, vendorId?: string, vendorName?: string, unitPrice?: number, format?: string, shippingCost?: number) => {
      const product = models.products.find((p) => p.id === productId)
      if (!product) return
      const fmt = format ?? product.formats?.[0] ?? '2 mg'
      const price = unitPrice ?? product.startingPrice ?? 20
      const vName = vendorName ?? models.vendors.find((v) => v.id === vendorId)?.name ?? vendorId ?? 'Sample Vendor'
      const vId = vendorId ?? 'default'
      const lineId = `${productId}-${vId}`
      const ship = shippingCost ?? models.vendors.find((v) => v.id === vendorId)?.shippingCost ?? 0
      setCartLines((prev) => {
        const existing = prev.find((l) => l.id === lineId)
        if (existing) {
          return prev.map((l) => l.id === lineId ? { ...l, quantity: l.quantity + 1 } : l)
        }
        return [...prev, {
          id: lineId,
          product: product.name,
          format: fmt,
          vendor: vName,
          vendorId: vId,
          quantity: 1,
          unitPrice: price,
          imageSrc: '',
          shippingCost: ship,
        }]
      })
      demo(`${product.name} added to cart`)
    },
    updateCartQuantity: (lineId: string, quantity: number) => {
      if (quantity <= 0) {
        setCartLines((prev) => prev.filter((l) => l.id !== lineId))
      } else {
        setCartLines((prev) => prev.map((l) => l.id === lineId ? { ...l, quantity } : l))
      }
    },
    removeCartLine: (lineId: string) => {
      setCartLines((prev) => prev.filter((l) => l.id !== lineId))
    },
    clearCart: () => setCartLines([]),
    beginCheckout: () => {
      previewAction('beginCheckout', 'Opened the synthetic checkout')
      navigate('/cart')
    },
    submitCheckout: (_form: HTMLFormElement) => {
      const subtotal = cartLines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0)
      setLastOrderTotal(subtotal + 12)
      setCartLines([])
      demo('Order placed! Redirecting to order status…')
      previewAction('submitCheckout', 'Synthetic checkout callback completed')
      navigate('/order/status/preview')
    },
    submitEmail: () => previewAction('submitEmail', 'Synthetic email callback completed'),
    submitLogin: () => previewAction('submitLogin', 'Synthetic sign-in callback completed'),
    submitCoa: () => previewAction('submitCoa', 'Synthetic submission callback completed'),
    verifyBatch: () => previewAction('verifyBatch', 'Synthetic verification callback completed'),
    createVendor: () => previewAction('createVendor', 'Synthetic create callback completed'),
    sellerAction: () => previewAction('sellerAction', 'Synthetic seller callback completed'),
    adminAction: () => previewAction('adminAction', 'Synthetic admin callback completed'),
    ...providedActions,
  }), [navigate, previewAction, providedActions, cartLines])

  const route = resolveRoute(pathname)
  const liveModels = { ...models, cart: cartLines, lastOrderTotal }
  const pageProps = { actions, models: liveModels, pathname, query, theme }
  const isPortal = ['seller', 'admin', 'staff', 'affiliate'].includes(route.family)
  const page = renderPage(route.family, pageProps)

  // Inject ALL purged CSS at runtime — the backend owner's build pipeline strips these
  // rules from storefront.css (client-rendered classes get purged by Tailwind).
  // A <style> tag injected via JS bypasses the CSS build pipeline entirely.
  // This covers escrow modal, COA page, and ps-private-surface (dark theme).
  useEffect(() => {
    const styleId = 'ps-runtime-purged-styles'
    if (document.getElementById(styleId)) return
    const style = document.createElement('style')
    style.id = styleId
    style.textContent = PURGED_CSS
    document.head.appendChild(style)
  }, [])

  return (
    <>
      {isPortal || route.family === 'api' ? (
        <div id="ps-storefront" className="ps-app" data-theme={theme}><ErrorBoundary>{page}</ErrorBoundary></div>
      ) : (
        <StorefrontShell actions={actions} cartCount={cartCount} cartLines={cartLines} pathname={pathname} theme={theme} vendors={models.vendors}>
          <ErrorBoundary>{page}</ErrorBoundary>
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
          allowedRouteFamilies={allowedRouteFamilies}
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
    case 'product': return <ProductMarketplacePage {...props} />
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
  allowedRouteFamilies,
}: {
  currentPath: string
  navigate: (href: string) => void
  open: boolean
  setOpen: (value: boolean) => void
  theme: FrontendTheme
  setTheme: (theme: FrontendTheme) => void
  allowedRouteFamilies?: readonly RouteFamily[]
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
            {routeManifest.filter((entry) =>
              (!allowedRouteFamilies || allowedRouteFamilies.includes(entry.family)) &&
              entry.paths.some((path) => previewRoutes.includes(path as never))
            ).map((entry) => {
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
