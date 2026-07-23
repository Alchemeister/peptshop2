import {
  ArrowUpRight,
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
import type { FrontendTheme, PeptShopActions } from './contracts'
import { FrontendLink, routeIsActive } from './navigation'

const navItems = [
  { href: '/products', label: 'Catalog' },
  { href: '/vendors', label: 'Vendors' },
  { href: '/coas', label: 'CoAs' },
  { href: '/verify', label: 'Verify' },
  { href: '/checkout', label: 'Checkout' },
]

type StorefrontShellProps = {
  actions: PeptShopActions
  cartCount: number
  children: React.ReactNode
  pathname: string
  theme: FrontendTheme
}

export function StorefrontShell({
  actions,
  cartCount,
  children,
  pathname,
  theme,
}: StorefrontShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [query, setQuery] = useState('')

  useEffect(() => {
    if (pathname) setMobileOpen(false)
  }, [pathname])

  const isHome = pathname === '/'

  return (
    <div className="ps-app" data-theme={theme}>
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
            <FrontendLink
              href="/cart"
              navigate={actions.navigate}
              className="ps-icon-button ps-cart-button"
              aria-label={`Cart with ${cartCount} items`}
            >
              <ShoppingBag size={23} strokeWidth={1.8} />
              {cartCount > 0 ? <span>{cartCount}</span> : null}
            </FrontendLink>
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
          <div className="ps-footer-lead">
            <div>
              <span className="ps-kicker">Research marketplace</span>
              <h2>Know the product, the batch, and the vendor.</h2>
            </div>
            <FrontendLink href="/products" navigate={actions.navigate} className="ps-text-link">
              Browse the catalog <ArrowUpRight size={17} />
            </FrontendLink>
          </div>
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
                ['/coa/submit-coa', 'Submit a COA'],
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
              ['/cart', 'Cart'],
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
  pathname,
  role,
}: {
  actions: PeptShopActions
  children: React.ReactNode
  pathname: string
  role: 'seller' | 'admin' | 'staff' | 'affiliate'
}) {
  const roleLabels = {
    seller: 'Seller workspace',
    admin: 'Admin console',
    staff: 'Staff workspace',
    affiliate: 'Affiliate workspace',
  }
  const navLabels =
    role === 'seller'
      ? ['Overview', 'Orders', 'Catalog', 'COAs', 'Shipping', 'Messages', 'Settings']
      : role === 'affiliate'
        ? ['Overview', 'Links', 'Conversions', 'Payouts']
        : ['Overview', 'Orders', 'Vendors', 'Evidence', 'Payments', 'Operations']
  const nav = navLabels.map((label) => ({
    label,
    href: role === 'admin' && label === 'Overview' ? '/admin' : undefined,
  }))

  if (role === 'admin') {
    nav.splice(1, 0, { label: 'Pricing', href: '/admin/pricing' })
  }

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
                item.href
                  ? pathname === item.href || (item.href === '/admin' && pathname === '/admin')
                    ? 'page'
                    : undefined
                  : index === 0
                    ? 'page'
                    : undefined
              }
              onClick={() => item.href && actions.navigate(item.href)}
            >
              <span>{String(index + 1).padStart(2, '0')}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="ps-portal-sidebar-footer">
          <span className="ps-status-dot" /> Live preview
          <button type="button" onClick={() => actions.navigate('/login')}>
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
