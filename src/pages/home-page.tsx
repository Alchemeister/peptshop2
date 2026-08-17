import {
  ArrowRight,
  Bitcoin,
  Calculator,
  CheckCircle2,
  Clock3,
  MapPin,
  Package,
  ShieldCheck,
  Sparkles,
  UserX,
} from 'lucide-react'
import type { PageComponentProps, VendorSummary } from '../contracts'
import { FrontendLink } from '../navigation'

export function HomePage({ actions, models }: PageComponentProps) {
  // Hand-picked popular products (by marketplace relevance, not just vendor count)
  const popularSlugs = ['pt-141', 'nad+', 'tesamorelin', 'ghk-cu', 'retatrutide', 'semaglutide']
  const popularProducts = popularSlugs
    .map((slug) => models.products.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => p !== undefined)
  const featuredVendors = models.vendors.slice(0, 3)
  const heroProduct = models.products.find((p) => p.slug === 'bpc-157') ?? popularProducts.find((product) => product.availability === 'available')
  const heroVendors = featuredVendors.slice(0, Math.min(3, heroProduct?.vendorCount ?? 0))

  return (
    <div className="ps-app" style={{ paddingInline: 0 }}>
      {/* ── Dark industrial hero ── */}
      <section className="ps-home-hero">
        <div className="ps-home-hero-copy">
          <img src="/peptshop-logo-white.svg" alt="PeptShop" className="ps-hero-logo" />
          <div className="ps-home-overline">
            <span>Live marketplace</span>
            <span>Per-mg pricing</span>
            <span>Public CoAs</span>
          </div>

          <h1>
            Research<br />
            <span>compounds,</span>
            verified.
          </h1>

          <p>
            Browse research compounds from vetted suppliers. Transparent per-mg pricing,
            public certificates of analysis, and crypto or card checkout — no signup required.
          </p>

          <div className="ps-hero-search" role="search">
            <SearchIcon />
            <input
              type="search"
              placeholder="Search compounds…"
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  actions.navigate('/products?q=' + encodeURIComponent((event.target as HTMLInputElement).value))
                }
              }}
            />
            <FrontendLink
              href="/products"
              navigate={actions.navigate}
              className="ps-primary-action"
            >
              Browse Catalog <ArrowRight size={16} />
            </FrontendLink>
          </div>

          <div className="ps-home-proof-row">
            <span><ShieldCheck size={14} /> Supplier-vetted</span>
            <span><Bitcoin size={14} /> Crypto or card checkout</span>
            <span><UserX size={14} /> No signup required</span>
          </div>
        </div>

        <div className="ps-featured-market-card-wrap">
          {heroProduct ? (
            <FrontendLink
              href={`/products/${heroProduct.slug}`}
              navigate={actions.navigate}
              className="ps-featured-market-card"
            >
              <div className="ps-featured-market-head">
                <span>Featured · {heroProduct.name}</span>
                <span className="ps-live-indicator">
                  <i /> Live
                </span>
              </div>

              <div className="ps-featured-vial">
                <span className="ps-vial-halo" />
                <img src={heroProduct.imageSrc} alt={`${heroProduct.name} vial`} />
              </div>

              <div className="ps-featured-market-copy">
                <span>10-vial pack</span>
                <h2>{heroProduct.name}</h2>
                <div>
                  <p>
                    {heroProduct.startingPrice === null
                      ? '—'
                      : `$${heroProduct.startingPrice.toFixed(2)}`}
                    {heroProduct.startingPrice !== null && <small>/mg</small>}
                  </p>
                  <p>
                    {heroProduct.vendorCount}
                    <small>{heroProduct.vendorCount === 1 ? 'vendor' : 'vendors'}</small>
                  </p>
                </div>
              </div>

              <div className="ps-featured-card-cta">
                Compare vendors <ArrowRight size={16} />
              </div>
            </FrontendLink>
          ) : (
            <FrontendLink
              href="/products"
              navigate={actions.navigate}
              className="ps-featured-market-card"
              style={{ alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}
            >
              <Package size={32} color="rgba(255,255,255,0.4)" />
              <div style={{ padding: '2rem', color: 'rgba(255,255,255,0.6)' }}>
                <small style={{ display: 'block', fontSize: '0.67rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Coming Soon</small>
                <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 620, color: '#fff' }}>Verified vendors are joining</h2>
                <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>The PeptShop catalog is being prepared.</p>
                <span style={{ color: 'var(--ps-accent)', fontSize: '0.76rem', fontWeight: 750 }}>Browse the full catalog →</span>
              </div>
            </FrontendLink>
          )}
        </div>
      </section>

      {/* ── Ticker bar ── */}
      <section className="ps-home-ticker" aria-label="Marketplace stats">
        <div>
          <strong>{models.products.length}</strong>
          <span>Compounds listed</span>
        </div>
        <div>
          <strong>{models.vendors.length}</strong>
          <span>Vetted suppliers</span>
        </div>
        <div>
          <strong>2</strong>
          <span>Payment methods</span>
        </div>
        <div>
          <strong>Never</strong>
          <span>Signup required</span>
        </div>
      </section>

      {/* ── Popular product cards ── */}
      <section className="ps-home-products">
        <div className="ps-section-shell">
          <div className="ps-section-intro">
            <div>
              <span className="ps-kicker">Catalog</span>
              <h2>Popular compounds.</h2>
            </div>
            <p>
              In stock and ready to ship. Compare verified listings, pack sizes, and
              fulfillment terms before you buy.
            </p>
          </div>

          <div className="ps-catalog-grid ps-home-catalog-grid">
            {popularProducts.map((product) => (
              <FrontendLink
                key={product.id}
                href={`/products/${product.slug}`}
                navigate={actions.navigate}
                className="ps-catalog-card"
              >
                <div className="ps-catalog-card-visual">
                  <img src={product.imageSrc} alt={`${product.name} vial`} />
                  <i>{product.coaCount > 0 ? `${product.coaCount} COA${product.coaCount === 1 ? '' : 's'}` : null}</i>
                </div>
                <div className="ps-catalog-card-copy">
                  <h2>{product.name}</h2>
                  <p>{product.formats.slice(0, 3).join(' · ')}</p>
                  <div>
                    <span>{product.vendorCount ? `${product.vendorCount} ${product.vendorCount === 1 ? 'vendor' : 'vendors'}` : 'Join watchlist'}</span>
                    {(() => { const r = product.regions ?? (product.vendorCount >= 3 ? ['us', 'eu'] : product.vendorCount >= 1 ? ['us'] : []); return r.length ? <small className="ps-region-badge">{r.map(x => x.toUpperCase()).join(' · ')}</small> : null; })()}
                    <strong>{product.startingPrice === null ? 'No live offers' : `$${product.startingPrice.toFixed(2)}/mg`}</strong>
                  </div>
                </div>
              </FrontendLink>
            ))}
          </div>

          <FrontendLink
            href="/products"
            navigate={actions.navigate}
            className="ps-outline-action"
            style={{ marginTop: '1.5rem' }}
          >
            View all {models.products.length} compounds <ArrowRight size={16} />
          </FrontendLink>
        </div>
      </section>

      {/* ── Evidence band ── */}
      <section className="ps-evidence-band">
        <div className="ps-evidence-band-copy">
          <span className="ps-kicker">Evidence</span>
          <h2>Every batch. Every claim. Public.</h2>
          <p>
            Vendors and independent labs publish certificates of analysis for every
            batch. Verify purity, compare labs, and trace what you buy to independent
            test results — all before checkout.
          </p>
          <div className="ps-button-row">
            <FrontendLink
              href="/coas"
              navigate={actions.navigate}
              className="ps-dark-link"
            >
              Browse CoA library <ArrowRight size={16} />
            </FrontendLink>
            <FrontendLink
              href="/verify"
              navigate={actions.navigate}
              className="ps-dark-link"
            >
              Verify a batch
            </FrontendLink>
          </div>
        </div>

        {models.coas.length > 0 ? (
          <div className="ps-evidence-sheet">
            <div className="ps-evidence-sheet-head">
              <span>CoA</span>
              <span>{models.coas[0].lab}</span>
              <small>{models.coas[0].batch}</small>
            </div>
            <div className="ps-evidence-result">
              <span>Purity</span>
              <strong>{models.coas[0].purity}</strong>
              <CheckCircle2 size={28} />
            </div>
            <dl>
              <div>
                <dt>Compound</dt>
                <dd>{models.coas[0].product}</dd>
              </div>
              <div>
                <dt>Vendor</dt>
                <dd>{models.coas[0].vendor}</dd>
              </div>
              <div>
                <dt>Tested</dt>
                <dd>{models.coas[0].testedAt}</dd>
              </div>
              <div>
                <dt>Result</dt>
                <dd>{models.coas[0].result === 'pass' ? 'Pass' : 'In review'}</dd>
              </div>
            </dl>
          </div>
        ) : (
          <div className="ps-evidence-sheet ps-evidence-sheet-pending">
            <div className="ps-evidence-sheet-head">
              <span>Awaiting evidence</span>
              <small>Pending</small>
            </div>
            <div className="ps-evidence-result ps-evidence-result-pending">
              <span>No published record</span>
              <strong>—</strong>
              <Clock3 size={28} />
            </div>
            <dl>
              <div>
                <dt>Compound</dt>
                <dd>Pending</dd>
              </div>
              <div>
                <dt>Batch</dt>
                <dd>Pending</dd>
              </div>
              <div>
                <dt>Method</dt>
                <dd>Pending</dd>
              </div>
              <div>
                <dt>Lab ID</dt>
                <dd>Pending</dd>
              </div>
            </dl>
          </div>
        )}
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="ps-how-section">
        <div className="ps-section-shell">
          <div className="ps-section-intro ps-section-intro-compact">
            <div>
              <span className="ps-kicker">Process</span>
              <h2>How PeptShop Works</h2>
            </div>
          </div>

          <ol className="ps-process-list">
            <li>
              <span>01</span>
              <h3>Browse &amp; Compare</h3>
              <p>
                Find your compound, compare suppliers side by side, and see per-mg
                pricing and public certificates of analysis at a glance.
              </p>
            </li>
            <li>
              <span>02</span>
              <h3>Pick Your Supplier</h3>
              <p>
                Choose the dosage and supplier that fits your timeline and purity
                needs. Every batch backed by a verifiable COA.
              </p>
            </li>
            <li>
              <span>03</span>
              <h3>Pay with Crypto or Card</h3>
              <p>
                Checkout with BTC, ETH, USDT, USDC, XMR, or 100+ coins via
                NOWPayments. Card also accepted. No account, no email required to order.
              </p>
            </li>
          </ol>
        </div>
      </section>

      {/* ── Featured vendors ── */}
      {featuredVendors.length > 0 ? (
        <section className="ps-home-products" style={{ paddingBlock: 'clamp(2rem, 4vw, 4rem)' }}>
          <div className="ps-section-shell">
            <div className="ps-section-intro">
              <div>
                <span className="ps-kicker">Suppliers</span>
                <h2>Featured Suppliers</h2>
              </div>
              <p>Identity checked before listing. Every vendor vetted before onboarding.</p>
            </div>

            <div className="ps-vendor-directory" style={{ marginTop: '2rem' }}>
              {featuredVendors.map((vendor, index) => (
                <VendorRow key={vendor.id} index={index + 1} vendor={vendor} navigate={actions.navigate} />
              ))}
            </div>

            <FrontendLink
              href="/vendors"
              navigate={actions.navigate}
              className="ps-outline-action"
              style={{ marginTop: '1.5rem' }}
            >
              View all suppliers <ArrowRight size={16} />
            </FrontendLink>
          </div>
        </section>
      ) : null}
    </div>
  )
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}

function VendorRow({
  index,
  navigate,
  vendor,
}: {
  index: number
  navigate: (href: string) => void
  vendor: VendorSummary
}) {
  const initials = vendor.name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')

  return (
    <FrontendLink
      href={`/vendors/${vendor.slug}`}
      navigate={navigate}
      className="ps-vendor-row"
    >
      <span className="ps-vendor-rank">{String(index).padStart(2, '0')}</span>
      <span className="ps-vendor-monogram">{initials}</span>
      <div className="ps-vendor-name">
        <h2>{vendor.name}</h2>
        <p>
          <MapPin size={12} /> {vendor.location || 'Location pending'}
        </p>
      </div>
      <div className="ps-vendor-rating">
        <Sparkles size={14} />
        <span>{vendor.rating}</span>
      </div>
      <div className="ps-vendor-fulfillment">
        <Package size={14} />
        <strong>{vendor.fulfillment}</strong>
      </div>
      <small className={`ps-trust-label is-${vendor.status}`}>{vendor.status}</small>
      <ArrowRight size={16} className="ps-ledger-arrow" />
    </FrontendLink>
  )
}