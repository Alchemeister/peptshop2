import {
  ArrowRight,
  Bitcoin,
  BookOpen,
  Coins,
  DollarSign,
  FileCheck2,
  Menu,
  Search,
  ShieldAlert,
  ShoppingBag,
  Store,
  X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import type { CartLine, FrontendTheme, PeptShopActions } from './contracts'
import { FrontendLink, routeIsActive } from './navigation'

const navItems = [
  { href: '/products', label: 'Catalog' },
  { href: '/vendors', label: 'Vendors' },
  { href: '/coas', label: 'CoAs' },
  { href: '/verify', label: 'Verify' },
]

type StorefrontShellProps = {
  actions: PeptShopActions
  cartCount: number
  cartLines: CartLine[]
  children: React.ReactNode
  pathname: string
  theme: FrontendTheme
}

export function StorefrontShell({
  actions,
  cartCount,
  cartLines,
  children,
  pathname,
  theme,
}: StorefrontShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [cartPreviewOpen, setCartPreviewOpen] = useState(false)

  useEffect(() => {
    if (pathname) setMobileOpen(false)
  }, [pathname])

  const isHome = pathname === '/'

  return (
    <div id="ps-storefront" className="ps-app" data-theme={theme}>
      <a className="ps-skip-link" href="#main-content">
        Skip to content
      </a>
      <header className={`ps-site-header ${isHome ? 'ps-site-header-home' : ''}`}>
        <div className="ps-header-inner">
          <FrontendLink
            href="/"
            navigate={actions.navigate}
            className="ps-brand"
            aria-label="PeptShop home"
          >
            <img src="/peptshop-logo.svg" alt="" />
            <span>peptshop</span>
          </FrontendLink>

          {!isHome ? (
            <form
              className="ps-header-search"
              onSubmit={(event) => {
                event.preventDefault()
                actions.searchProducts(query)
              }}
            >
              <Search size={16} strokeWidth={1.8} aria-hidden="true" />
              <input
                value={query}
                onChange={(event) => setQuery(event.currentTarget.value)}
                placeholder="Search compounds"
                aria-label="Search compounds"
              />
            </form>
          ) : null}

          <nav className="ps-desktop-nav" aria-label="Primary navigation">
            {navItems.map((item) => (
              <FrontendLink
                key={item.href}
                href={item.href}
                navigate={actions.navigate}
                aria-current={routeIsActive(pathname, item.href) ? 'page' : undefined}
              >
                {item.label}
              </FrontendLink>
            ))}
          </nav>
          <div className="ps-header-actions">
            <div
              className="ps-cart-wrapper"
              onMouseEnter={() => setCartPreviewOpen(true)}
              onMouseLeave={() => setCartPreviewOpen(false)}
            >
              <FrontendLink
                href="/cart"
                navigate={actions.navigate}
                className="ps-icon-button ps-cart-button"
                aria-label={`Cart with ${cartCount} items`}
              >
                <ShoppingBag size={23} strokeWidth={1.8} />
                {cartCount > 0 ? <span>{cartCount}</span> : null}
              </FrontendLink>
              {cartPreviewOpen && cartCount > 0 ? (
                <>
                  <div className="ps-cart-overlay" onClick={() => setCartPreviewOpen(false)} />
                  <aside className="ps-cart-drawer" role="dialog" aria-label="Cart preview">
                    <header className="ps-cart-drawer-head">
                      <h2>Your cart</h2>
                      <button type="button" className="ps-primary-action ps-cart-drawer-checkout" onClick={() => actions.navigate('/cart')}>
                        Checkout <ArrowRight size={15} />
                      </button>
                    </header>
                    <div className="ps-cart-drawer-body">
                      {(() => {
                        // Group by vendor
                        const groups: Record<string, CartLine[]> = {}
                        for (const line of cartLines) {
                          const v = line.vendor || 'Unassigned'
                          if (!groups[v]) groups[v] = []
                          groups[v].push(line)
                        }
                        return Object.entries(groups).map(([vendorName, lines]) => {
                          const groupSubtotal = lines.reduce((s, l) => s + l.unitPrice * l.quantity, 0)
                          const freeShipThreshold = 1200
                          const progress = Math.min(100, (groupSubtotal / freeShipThreshold) * 100)
                          return (
                            <div key={vendorName} className="ps-cart-drawer-vendor">
                              <div className="ps-cart-drawer-vendor-head">
                                <strong>{vendorName}</strong>
                                <div className="ps-cart-drawer-vendor-subtotal">
                                  <small>Subtotal</small>
                                  <b>${groupSubtotal.toFixed(2)}</b>
                                </div>
                              </div>
                              {lines.map((line) => (
                                <div key={line.id} className="ps-cart-drawer-item">
                                  <div className="ps-cart-drawer-item-info">
                                    <strong>{line.product}</strong>
                                    <small>{line.format} · qty {line.quantity}</small>
                                  </div>
                                  <div className="ps-cart-drawer-item-price">
                                    <span className="ps-cart-drawer-item-total">${(line.unitPrice * line.quantity).toFixed(2)}</span>
                                    <small>${line.unitPrice.toFixed(2)} ea</small>
                                  </div>
                                </div>
                              ))}
                              <div className="ps-cart-drawer-progress">
                                <div className="ps-cart-drawer-progress-bar">
                                  <div className="ps-cart-drawer-progress-fill" style={{ width: `${progress}%` }} />
                                </div>
                                <small>{groupSubtotal >= freeShipThreshold ? 'Free shipping unlocked!' : `Add $${(freeShipThreshold - groupSubtotal).toFixed(0)} for free shipping`}</small>
                              </div>
                            </div>
                          )
                        })
                      })()}
                    </div>
                    <footer className="ps-cart-drawer-foot">
                      <div className="ps-cart-drawer-total-row">
                        <span>Total</span>
                        <strong>${cartLines.reduce((s, l) => s + l.unitPrice * l.quantity, 0).toFixed(2)}</strong>
                      </div>
                    </footer>
                  </aside>
                </>
              ) : null}
            </div>
            <button
              type="button"
              className="ps-icon-button ps-mobile-menu-button"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((open) => !open)}
            >
              {mobileOpen ? <X size={21} /> : <Menu size={21} />}
              <span className="ps-mobile-menu-label">{mobileOpen ? 'Close' : 'Menu'}</span>
            </button>
          </div>
        </div>

        {mobileOpen ? (
          <nav className="ps-mobile-nav" aria-label="Mobile navigation">
            {navItems.map((item) => (
              <FrontendLink key={item.href} href={item.href} navigate={actions.navigate}>
                {item.label}
              </FrontendLink>
            ))}
            <FrontendLink href="/seller" navigate={actions.navigate}>
              Seller portal
            </FrontendLink>
          </nav>
        ) : null}
      </header>

      <main id="main-content">{children}</main>

      {isHome ? (
        <ClassicHomeFooter navigate={actions.navigate} />
      ) : (
        <footer className="ps-footer">
          <div className="ps-footer-grid">
            <div className="ps-footer-brand">
              <FrontendLink href="/" navigate={actions.navigate} className="ps-brand">
                <img src="/peptshop-logo.svg" alt="" />
                <span>peptshop</span>
              </FrontendLink>
              <p>Independent comparison, transparent pricing, and batch-level evidence.</p>
            </div>
            <FooterColumn
              title="Marketplace"
              icon={<Store size={15} />}
              links={[
                ['/products', 'Catalog'],
                ['/vendors', 'Vendors'],
                ['/shipping', 'Shipping'],
              ]}
              navigate={actions.navigate}
            />
            <FooterColumn
              title="Evidence"
              icon={<FileCheck2 size={15} />}
              links={[
                ['/coas', 'COA library'],
                ['/verify', 'Verify a batch'],
                ['/order/status', 'Track an order'],
              ]}
              navigate={actions.navigate}
            />
            <FooterColumn
              title="Learn"
              icon={<BookOpen size={15} />}
              links={[
                ['/articles', 'Articles'],
                ['/faq', 'FAQ'],
                ['/about', 'About'],
                ['/contact', 'Contact'],
              ]}
              navigate={actions.navigate}
            />
          </div>
          <div className="ps-footer-bottom">
            <p>For laboratory research use only. Not for human consumption.</p>
            <div>
              <FrontendLink href="/privacy" navigate={actions.navigate}>
                Privacy
              </FrontendLink>
              <FrontendLink href="/terms" navigate={actions.navigate}>
                Terms
              </FrontendLink>
              <FrontendLink href="/disclaimers" navigate={actions.navigate}>
                Disclaimers
              </FrontendLink>
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}

function FooterColumn({
  title,
  icon,
  links,
  navigate,
}: {
  title: string
  icon: React.ReactNode
  links: Array<[string, string]>
  navigate: (href: string) => void
}) {
  return (
    <div className="ps-footer-column">
      <h3>
        {icon}
        {title}
      </h3>
      {links.map(([href, label]) => (
        <FrontendLink key={href} href={href} navigate={navigate}>
          {label}
        </FrontendLink>
      ))}
    </div>
  )
}

const classicCryptoBadges = [
  { label: 'BTC', icon: Bitcoin, color: 'is-bitcoin' },
  { label: 'ETH', icon: Coins, color: 'is-ethereum' },
  { label: 'USDC', icon: DollarSign, color: 'is-usdc' },
  { label: 'USDT', icon: DollarSign, color: 'is-usdt' },
  { label: 'XMR', icon: Coins, color: 'is-monero' },
]

function ClassicHomeFooter({ navigate }: { navigate: (href: string) => void }) {
  return (
    <footer className="ps-classic-footer">
      <div className="ps-classic-footer-container">
        <div className="ps-classic-footer-grid">
          <div className="ps-classic-footer-brand">
            <FrontendLink href="/" navigate={navigate} aria-label="PeptShop home">
              <img src="/peptshop-logo.svg" alt="PeptShop" />
            </FrontendLink>
            <p>
              Research compound marketplace. Upfront per-mg pricing, public CoAs, and crypto
              checkout.
            </p>
          </div>
          <ClassicFooterColumn
            title="Shop"
            links={[
              ['/products', 'All Products'],
              ['/vendors', 'Vendors'],
              ['/coas', 'CoA Labs'],
            ]}
            navigate={navigate}
          />
          <ClassicFooterColumn
            title="Support"
            links={[
              ['/order/status', 'Find My Order'],
              ['/coas', 'COA library'],
              ['/verify', 'Verify a batch'],
              ['/contact', 'Contact'],
            ]}
            navigate={navigate}
          />
          <ClassicFooterColumn
            title="Legal"
            links={[
              ['/disclaimers', 'Disclaimers'],
              ['/privacy', 'Privacy'],
              ['/terms', 'Terms'],
            ]}
            navigate={navigate}
          />
        </div>

        <div className="ps-classic-payment-row">
          <span>We accept</span>
          <div>
            {classicCryptoBadges.map(({ color, icon: Icon, label }) => (
              <span key={label}>
                <Icon className={color} size={12} />
                {label}
              </span>
            ))}
          </div>
        </div>

        <div className="ps-classic-footer-disclaimer">
          <ShieldAlert size={18} />
          <p>
            <strong>Research use only.</strong> Products are for in-vitro and laboratory use, not
            for human consumption, diagnosis, or treatment. Suppliers are responsible for listing
            accuracy. PeptShop processes crypto payments and never holds inventory.
          </p>
        </div>

        <div className="ps-classic-footer-bottom">
          <p>© {new Date().getFullYear()} PeptShop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

function ClassicFooterColumn({
  links,
  navigate,
  title,
}: {
  links: Array<[string, string]>
  navigate: (href: string) => void
  title: string
}) {
  return (
    <div className="ps-classic-footer-column">
      <h2>{title}</h2>
      <ul>
        {links.map(([href, label]) => (
          <li key={href}>
            <FrontendLink href={href} navigate={navigate}>
              {label}
            </FrontendLink>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function PortalShell({
  actions,
  children,
  environmentLabel = 'Live preview',
  onSignOut,
  pathname,
  role,
}: {
  actions: PeptShopActions
  children: React.ReactNode
  environmentLabel?: string
  onSignOut?: () => void
  pathname: string
  role: 'seller' | 'admin' | 'staff' | 'affiliate'
}) {
  const [activeSellerHref, setActiveSellerHref] = useState('/seller#dashboard')
  const roleLabels = {
    seller: 'Seller workspace',
    admin: 'Admin console',
    staff: 'Staff workspace',
    affiliate: 'Affiliate workspace',
  }
  const nav =
    role === 'seller'
      ? [
          { label: 'Overview', href: '/seller#dashboard' },
          { label: 'Orders', href: '/seller#orders' },
          { label: 'Catalog', href: '/seller#catalog' },
          { label: 'COAs', href: '/seller#batches' },
          { label: 'Shipping', href: '/seller#shipping' },
          { label: 'Messages', href: '/seller#inbox' },
          { label: 'Settings', href: '/seller#availability' },
        ]
      : (role === 'affiliate'
          ? ['Overview', 'Links', 'Conversions', 'Payouts']
          : ['Overview', 'Orders', 'Vendors', 'Evidence', 'Payments', 'Operations']
        ).map((label) => ({
          label,
          href: role === 'admin' && label === 'Overview' ? '/admin' : undefined,
        }))

  if (role === 'admin') {
    nav.splice(1, 0, { label: 'Pricing', href: '/admin/pricing' })
  }

  useEffect(() => {
    if (role !== 'seller') return

    const syncActiveSellerHref = () => {
      const hash = window.location.hash || '#dashboard'
      setActiveSellerHref(`/seller${hash}`)
    }

    syncActiveSellerHref()
    window.addEventListener('hashchange', syncActiveSellerHref)
    window.addEventListener('popstate', syncActiveSellerHref)
    return () => {
      window.removeEventListener('hashchange', syncActiveSellerHref)
      window.removeEventListener('popstate', syncActiveSellerHref)
    }
  }, [role])

  return (
    <div className="ps-portal-shell">
      <aside className="ps-portal-sidebar">
        <FrontendLink href="/" navigate={actions.navigate} className="ps-brand ps-brand-inverse">
          <img src="/peptshop-logo.svg" alt="" />
          <span>peptshop</span>
        </FrontendLink>
        <p className="ps-portal-role">{roleLabels[role]}</p>
        <nav aria-label={`${roleLabels[role]} navigation`}>
          {nav.map((item, index) => (
            <button
              key={item.label}
              type="button"
              aria-current={
                role === 'seller' && item.href
                  ? activeSellerHref === item.href
                    ? 'page'
                    : undefined
                  : item.href
                    ? pathname === item.href || (item.href === '/admin' && pathname === '/admin')
                    ? 'page'
                    : undefined
                    : index === 0
                      ? 'page'
                      : undefined
              }
              onClick={() => {
                if (!item.href) return
                if (role === 'seller') setActiveSellerHref(item.href)
                actions.navigate(item.href)
              }}
            >
              <span>{String(index + 1).padStart(2, '0')}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="ps-portal-sidebar-footer">
          <span className="ps-status-dot" /> {environmentLabel}
          <button
            type="button"
            onClick={() => {
              if (onSignOut) {
                onSignOut()
                return
              }
              actions.navigate('/login')
            }}
          >
            Sign out
          </button>
        </div>
      </aside>
      <section className="ps-portal-main" data-pathname={pathname}>
        {children}
      </section>
    </div>
  )
}
