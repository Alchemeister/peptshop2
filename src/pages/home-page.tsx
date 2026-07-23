import {
  ArrowRight,
  Bitcoin,
  Calculator,
  MapPin,
  Package,
  ShieldCheck,
  Sparkles,
  UserX,
} from 'lucide-react'
import type { PageComponentProps, ProductSummary, VendorSummary } from '../contracts'
import { FrontendLink } from '../navigation'

export function HomePage({ actions, models }: PageComponentProps) {
  const popularProducts = [...models.products]
    .sort((left, right) => {
      if (left.availability !== right.availability) {
        return left.availability === 'available' ? -1 : 1
      }
      return right.vendorCount - left.vendorCount
    })
    .slice(0, 6)
  const featuredVendors = models.vendors.slice(0, 3)
  const heroProduct = popularProducts.find((product) => product.availability === 'available')
  const heroVendors = featuredVendors.slice(0, Math.min(3, heroProduct?.vendorCount ?? 0))

  return (
    <div className="ps-classic-home">
      <section className="ps-classic-hero">
        <div className="ps-classic-container ps-classic-hero-grid">
          <div className="ps-classic-hero-copy">
            <img
              src="/peptshop-logo.svg"
              alt="PeptShop"
              width="200"
              height="120"
              className="ps-classic-hero-logo"
            />
            <p className="ps-classic-hero-intro">
              Browse research compounds from vetted suppliers. Transparent per-mg pricing, public CoAs,
              and crypto checkout — no signup required.
            </p>

            <div className="ps-classic-hero-actions">
              <FrontendLink
                href="/products"
                navigate={actions.navigate}
                className="ps-classic-button-primary"
              >
                Browse Catalog <ArrowRight size={18} />
              </FrontendLink>
              <a href="#how-it-works" className="ps-classic-button-secondary">
                How It Works
              </a>
            </div>

            <div className="ps-classic-secondary-links">
              <FrontendLink href="/vendors" navigate={actions.navigate}>
                Vendors
              </FrontendLink>
              <span aria-hidden="true">·</span>
              <FrontendLink href="/coas" navigate={actions.navigate}>
                CoA Labs
              </FrontendLink>
            </div>

            <div className="ps-classic-hero-proof" aria-label="Marketplace benefits">
              <span>
                <ShieldCheck size={16} /> Supplier-vetted listings
              </span>
              <span>
                <Bitcoin size={16} /> Crypto checkout
              </span>
              <span>
                <UserX size={16} /> No signup required
              </span>
            </div>
          </div>

          <div className="ps-classic-hero-card-wrap">
            {heroProduct ? (
              <FrontendLink
                href={`/products/${heroProduct.slug}`}
                navigate={actions.navigate}
                className="ps-classic-hero-card"
              >
                <div className="ps-classic-hero-card-head">
                  <span>{heroProduct.name}</span>
                  <small>10-vial pack</small>
                </div>
                <h2>{heroProduct.name}</h2>
                <div className="ps-classic-hero-price">
                  <strong>
                    {heroProduct.startingPrice === null
                      ? '—'
                      : `$${heroProduct.startingPrice.toFixed(2)}`}
                  </strong>
                  {heroProduct.startingPrice !== null ? <span>/mg</span> : null}
                </div>
                <div className="ps-classic-hero-vendors">
                  {heroVendors.map((vendor, index) => (
                    <div key={vendor.id} className={index === 0 ? 'is-primary' : undefined}>
                      <span>
                        <i />
                        {vendor.name}
                      </span>
                      <strong>{vendor.fulfillment}</strong>
                    </div>
                  ))}
                </div>
                <div className="ps-classic-hero-card-link">
                  Compare {heroProduct.vendorCount}{' '}
                  {heroProduct.vendorCount === 1 ? 'vendor' : 'vendors'} →
                </div>
              </FrontendLink>
            ) : (
              <FrontendLink
                href="/products"
                navigate={actions.navigate}
                className="ps-classic-hero-card ps-classic-empty-card"
              >
                <Package size={30} />
                <small>Coming Soon</small>
                <h2>Verified vendors are joining</h2>
                <p>The PeptShop catalog is being prepared. Check back soon.</p>
                <span>Browse the full catalog →</span>
              </FrontendLink>
            )}
            <span className="ps-classic-hero-blob" aria-hidden="true" />
          </div>
        </div>
      </section>

      <section className="ps-classic-trust-bar" aria-label="PeptShop marketplace standards">
        <div className="ps-classic-container ps-classic-trust-grid">
          <TrustItem icon={<ShieldCheck size={20} />} title="Vetted Suppliers">
            Identity checked before onboarding
          </TrustItem>
          <TrustItem icon={<Bitcoin size={20} />} title="Crypto Payments">
            All major coins via NOWPayments
          </TrustItem>
          <TrustItem icon={<Calculator size={20} />} title="Per-mg Pricing">
            Compare value across vendors
          </TrustItem>
          <TrustItem icon={<UserX size={20} />} title="No Account Needed">
            Browse, buy, track — no signup
          </TrustItem>
        </div>
      </section>

      <section className="ps-classic-section">
        <div className="ps-classic-container">
          <div className="ps-classic-section-heading">
            <div>
              <h2>Popular</h2>
              <p>In stock and ready to ship.</p>
            </div>
            <FrontendLink href="/products" navigate={actions.navigate}>
              View all <ArrowRight size={16} />
            </FrontendLink>
          </div>

          <div className="ps-classic-product-grid">
            {popularProducts.map((product) => (
              <ClassicProductCard key={product.id} product={product} navigate={actions.navigate} />
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="ps-classic-how">
        <div className="ps-classic-container">
          <h2>How PeptShop Works</h2>
          <ol>
            <HowStep number="1" title="Browse & Compare">
              Find your compound, compare suppliers side by side, and see per-mg pricing at a
              glance.
            </HowStep>
            <HowStep number="2" title="Pick Your Supplier">
              Choose the dosage and supplier that fits your timeline and purity needs.
            </HowStep>
            <HowStep number="3" title="Pay with Crypto">
              Checkout with BTC, ETH, USDT, USDC, XMR, or 100+ other coins via NOWPayments. No account, no email required to order.
            </HowStep>
          </ol>
        </div>
      </section>

      {featuredVendors.length > 0 ? (
        <section className="ps-classic-section ps-classic-vendors-section">
          <div className="ps-classic-container">
            <div className="ps-classic-section-heading">
              <div>
                <h2>Featured Suppliers</h2>
                <p>Identity checked before listing.</p>
              </div>
              <FrontendLink href="/vendors" navigate={actions.navigate}>
                View all suppliers <ArrowRight size={16} />
              </FrontendLink>
            </div>
            <div className="ps-classic-vendor-grid">
              {featuredVendors.map((vendor) => (
                <ClassicVendorCard key={vendor.id} vendor={vendor} navigate={actions.navigate} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  )
}

function TrustItem({
  children,
  icon,
  title,
}: {
  children: React.ReactNode
  icon: React.ReactNode
  title: string
}) {
  return (
    <div className="ps-classic-trust-item">
      <span>{icon}</span>
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  )
}

function ClassicProductCard({
  navigate,
  product,
}: {
  navigate: (href: string) => void
  product: ProductSummary
}) {
  const available = product.availability === 'available'
  return (
    <FrontendLink
      href={`/products/${product.slug}`}
      navigate={navigate}
      className="ps-classic-product-card"
    >
      <div className="ps-classic-product-image">
        <img src={product.imageSrc} alt={`${product.name} vial`} />
      </div>
      <div className="ps-classic-product-meta">
        <span>{product.name}</span>
        <small className={available ? 'is-available' : undefined}>
          <i /> {product.vendorCount} {product.vendorCount === 1 ? 'vendor' : 'vendors'} available
        </small>
      </div>
      <h3>{product.name}</h3>
      <div className="ps-classic-dose-list">
        {product.formats.slice(0, 4).map((format) => (
          <span key={format}>{format}</span>
        ))}
        {product.coaCount > 0 ? <span className="is-coa">CoA</span> : null}
      </div>
      <div className="ps-classic-product-price">
        <div>
          <small>{available ? 'As low as' : 'No vendors yet'}</small>
          <strong>
            {product.startingPrice === null ? '—' : `$${product.startingPrice.toFixed(2)}`}
          </strong>
          {product.startingPrice !== null ? <span>/mg</span> : null}
        </div>
        <ArrowRight size={18} />
      </div>
    </FrontendLink>
  )
}

function HowStep({
  children,
  number,
  title,
}: {
  children: React.ReactNode
  number: string
  title: string
}) {
  return (
    <li>
      <span>{number}</span>
      <h3>{title}</h3>
      <p>{children}</p>
    </li>
  )
}

function ClassicVendorCard({
  navigate,
  vendor,
}: {
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
      className="ps-classic-vendor-card"
    >
      <div className="ps-classic-vendor-head">
        <span className="ps-classic-vendor-mark">{initials}</span>
        <div>
          <h3>{vendor.name}</h3>
          <p>
            <MapPin size={12} /> {vendor.location || 'Location pending'} · <Sparkles size={12} /> {vendor.rating} rating
          </p>
        </div>
        <small className={`is-${vendor.status}`}>{vendor.status}</small>
      </div>
      <p className="ps-classic-vendor-description">{vendor.specialties.join(' · ')}</p>
      <dl>
        <div>
          <dt>Orders</dt>
          <dd>{vendor.orderCount.toLocaleString()}+</dd>
        </div>
        <div>
          <dt>Rating</dt>
          <dd>
            <Sparkles size={14} /> {vendor.rating}
          </dd>
        </div>
      </dl>
    </FrontendLink>
  )
}
