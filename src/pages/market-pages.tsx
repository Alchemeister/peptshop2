import {
  ArrowLeft,
  ArrowRight,
  Bell,
  Check,
  ChevronDown,
  CircleDollarSign,
  Clock3,
  FileCheck2,
  Filter,
  MapPin,
  Minus,
  PackageCheck,
  Plus,
  Search,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  Star,
  Truck,
  X,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import type { PageComponentProps, ProductSummary, VendorSummary } from '../contracts'
import { mockProduct, mockVendor } from '../mock-data'
import { FrontendLink } from '../navigation'
import {
  CompoundWaitlistDescription,
  CompoundWaitlistForm,
  CompoundWaitlistTitle,
  ProductAboutSection,
  ProductBackControlFrame,
  ProductDosageOptionFrame,
  ProductDosageSelectorFrame,
  ProductOffersSection,
  ProductPageFrame,
  ProductPageHero,
  ProductUnavailableState,
  VendorOfferCardFrame,
  VendorOfferOptionFrame,
} from '../product-page'

export function CatalogPage({ actions, models }: PageComponentProps) {
  const [query, setQuery] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const [stockOnly, setStockOnly] = useState(false)
  const visibleProducts = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return models.products.filter((product) => {
      if (stockOnly && product.availability !== 'available') return false
      return !normalized || `${product.name} ${product.category}`.toLowerCase().includes(normalized)
    })
  }, [models.products, query, stockOnly])

  return (
    <div className="ps-catalog-page ps-section-shell">
      <header className="ps-page-masthead">
        <span className="ps-kicker">Marketplace index</span>
        <div className="ps-page-title-row">
          <h1>All compounds</h1>
          <p>{models.products.length} research products with transparent availability.</p>
        </div>
      </header>

      <div className="ps-catalog-tools">
        <label className="ps-catalog-search">
          <Search size={18} />
          <span className="ps-visually-hidden">Search catalog</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.currentTarget.value)}
            placeholder="Search by compound or category"
          />
          {query ? <button type="button" onClick={() => setQuery('')} aria-label="Clear search"><X size={16} /></button> : null}
        </label>
        <button type="button" className="ps-filter-button" onClick={() => setFilterOpen((open) => !open)} aria-expanded={filterOpen}>
          <SlidersHorizontal size={17} /> Filters <ChevronDown size={15} />
        </button>
        <label className="ps-stock-switch">
          <input type="checkbox" checked={stockOnly} onChange={(event) => setStockOnly(event.currentTarget.checked)} />
          <span /> Available now
        </label>
      </div>

      {filterOpen ? (
        <div className="ps-filter-strip">
          <Filter size={16} />
          <button type="button">Warehouse <span>Any</span></button>
          <button type="button">Format <span>Any</span></button>
          <button type="button">Batch evidence <span>Any</span></button>
          <button type="button">Sort <span>Recommended</span></button>
        </div>
      ) : null}

      {visibleProducts.length ? (
        <div className="ps-catalog-grid">
          {visibleProducts.map((product) => (
            <CatalogCard key={product.id} product={product} navigate={actions.navigate} />
          ))}
        </div>
      ) : (
        <div className="ps-empty-state">
          <Search size={24} />
          <h2>No matching compounds</h2>
          <p>Try a shorter name or clear the availability filter.</p>
          <button type="button" onClick={() => { setQuery(''); setStockOnly(false) }}>Reset catalog</button>
        </div>
      )}
    </div>
  )
}

function CatalogCard({ product, navigate }: { product: ProductSummary; navigate: (href: string) => void }) {
  return (
    <FrontendLink href={`/products/${product.slug}`} navigate={navigate} className="ps-catalog-card">
      <div className="ps-catalog-card-visual">
        <span>{product.category}</span>
        <img src={product.imageSrc} alt={`${product.name} vial`} />
        <i>{product.coaCount} COAs</i>
      </div>
      <div className="ps-catalog-card-copy">
        <h2>{product.name}</h2>
        <p>{product.formats.join(' · ')}</p>
        <div>
          <span>{product.vendorCount ? `${product.vendorCount} vendors` : 'Join watchlist'}</span>
          <strong>{product.startingPrice === null ? 'No live offers' : `$${product.startingPrice.toFixed(2)}/mg`}</strong>
        </div>
      </div>
    </FrontendLink>
  )
}

// Product detail lookup: maps product name → extra fields not in ProductSummary
const productDetails: Record<string, { cas: string; formula: string; description: string }> = {
  'BPC-157': { cas: '137525-51-0', formula: 'C62H98N16O22', description: 'Synthetic pentadecapeptide derived from human gastric juice. Research suggests it promotes healing of tendons, muscles, and the nervous system.' },
  'Tirzepatide': { cas: '2023788-19-2', formula: 'C225H348N48O68', description: 'Dual GIP/GLP-1 receptor agonist. Research suggests significant effects on glycemic control and weight reduction.' },
  'NAD+': { cas: '53-84-9', formula: 'C21H27N7O14P2', description: 'Essential coenzyme in redox reactions and cellular energy metabolism. Research suggests benefits for aging, DNA repair, and mitochondrial function.' },
  'MOTS-c': { cas: '2030360-70-3', formula: 'C102H153N29O32S2', description: 'Mitochondrial-derived peptide. Research suggests metabolic regulation, insulin sensitivity, and exercise capacity benefits.' },
  'Tesamorelin': { cas: '106129-60-4', formula: 'C169H277N51O44', description: 'Growth hormone releasing hormone analog. Research suggests reduction in visceral adipose tissue and metabolic improvement.' },
  'SS-31': { cas: '927967-26-2', formula: 'C50H70N12O7', description: 'Mitochondria-targeted peptide. Research suggests protection against oxidative stress and mitochondrial dysfunction.' },
  'Semaglutide': { cas: '910463-19-5', formula: 'C187H291N45O52', description: 'GLP-1 receptor agonist. Research suggests significant effects on glycemic control, weight management, and cardiovascular outcomes.' },
  'Epitalon': { cas: '103640-04-0', formula: 'C14H22N4O9', description: 'Synthetic tetrapeptide. Research suggests telomere lengthening and anti-aging effects via melatonin regulation.' },
  'GHK-Cu': { cas: '89030-95-5', formula: 'C14H24CuN6O4', description: 'Copper peptide complex. Research suggests wound healing, collagen stimulation, and anti-inflammatory properties.' },
  'AOD-9604': { cas: '221231-10-3', formula: 'C78H123N23O23', description: 'Modified fragment of human growth hormone. Research suggests lipolytic effects without impacting insulin or growth.' },
  'TB-500': { cas: '1035302-50-1', formula: 'C18H31N7O8S', description: 'Synthetic version of thymosin beta-4. Research suggests tissue repair, inflammation reduction, and wound healing.' },
  'Melanotan II': { cas: '121062-08-6', formula: 'C50H69N11O9', description: 'Synthetic analog of alpha-MSH. Research suggests skin pigmentation and libido enhancement effects.' },
  'PT-141': { cas: '189691-06-3', formula: 'C50H68N12O8', description: 'Synthetic peptide analog. Research suggests sexual arousal enhancement via melanocortin receptor activation.' },
  'Hexarelin': { cas: '140703-51-1', formula: 'C49H57N11O8', description: 'Synthetic hexapeptide. Research suggests growth hormone secretion stimulation and cardioprotective effects.' },
  'CJC-1295': { cas: '863288-34-0', formula: 'C152H252N44O40', description: 'Growth hormone releasing hormone analog. Research suggests sustained GH release and IGF-1 elevation.' },
  'Ipamorelin': { cas: '170851-70-4', formula: 'C38H49N9O5', description: 'Synthetic pentapeptide. Research suggests selective GH release without cortisol or prolactin impact.' },
  'Retatrutide': { cas: '2373529-69-8', formula: 'C221H346N48O63', description: 'Triple agonist (GLP-1/GIP/GcgR). Research suggests unprecedented weight loss and metabolic improvement.' },
  'BPC-157 / TB-500 Blend': { cas: 'N/A', formula: 'Blend', description: 'Combined formulation of BPC-157 and TB-500. Research suggests synergistic tissue repair and anti-inflammatory effects.' },
}

export function ProductPage({ actions, models, query, theme, pathname }: PageComponentProps) {
  // Parse product name from URL — supports both /catalog/:name and /products/:slug
  let productName = ''
  if (pathname.includes('/catalog/')) {
    productName = decodeURIComponent(pathname.split('/catalog/')[1]?.split('?')[0] ?? '')
  } else if (pathname.includes('/products/')) {
    productName = decodeURIComponent(pathname.split('/products/')[1]?.split('?')[0] ?? '')
  } else if (pathname.includes('/peptides/')) {
    productName = decodeURIComponent(pathname.split('/peptides/')[1]?.split('?')[0] ?? '')
  }
  const source = models.products.find((p) => p.name === productName || p.slug === productName) ?? models.products.find((p) => p.name === 'BPC-157')!
  const details = productDetails[source?.name ?? ''] ?? { cas: 'N/A', formula: 'N/A', description: 'Product information supplied by the private application adapter.' }
  const dosages = source?.formats ?? ['2 mg', '5 mg', '10 mg']

  // Build vendor offers from mock vendors, priced per product
  const productVendors = useMemo(() => {
    const vendorData = [
      { id: 'vendor-northstar', name: 'Northstar Research', slug: 'northstar-research', location: 'United States', rating: 4.9, reviewCount: 184, fulfillment: '1–2 days', purity: 99.5, batch: 'PS-p1-2mg-A', offerPrice: source?.startingPrice ?? 42 },
      { id: 'vendor-retalux', name: 'Retalux', slug: 'retalux', location: 'United States', rating: 4.8, reviewCount: 142, fulfillment: '2–3 days', purity: 99.2, batch: 'RX-p2-2mg-B', offerPrice: (source?.startingPrice ?? 42) * 1.05 },
      { id: 'vendor-axiom', name: 'Axiom Peptides', slug: 'axiom-peptides', location: 'European Union', rating: 4.7, reviewCount: 98, fulfillment: '3–5 days', purity: 99.0, batch: 'AX-p3-2mg-C', offerPrice: (source?.startingPrice ?? 42) * 0.85 },
    ]
    return vendorData.slice(0, Math.max(1, source?.vendorCount ?? 1))
  }, [source])

  const [selectedDose, setSelectedDose] = useState(dosages[1] ?? dosages[0])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [selectedVendorId, setSelectedVendorId] = useState(productVendors[0]?.id ?? '')
  const empty = query.get('state') === 'empty'
  const selectedVendor = productVendors.find((v) => v.id === selectedVendorId) ?? productVendors[0]

  return (
    <div className="ps-product-route">
      <ProductPageFrame theme={theme}>
        <ProductPageHero
          productName={source?.name ?? 'Product'}
          dosageLabel="Dose per vial"
          cas={details.cas}
          formula={details.formula}
          imageSrc={source?.imageSrc ?? '/images/products/bpc-157.png'}
          backControl={
            <ProductBackControlFrame>
              <button type="button" aria-label="Return to catalog" onClick={() => actions.navigate('/products')}>
                <ArrowLeft size={20} strokeWidth={1.8} />
              </button>
            </ProductBackControlFrame>
          }
          dosageSelector={
            <ProductDosageSelectorFrame>
              {dosages.map((dose) => (
                <ProductDosageOptionFrame key={dose} selected={dose === selectedDose} onClick={() => setSelectedDose(dose)}>
                  {dose}
                </ProductDosageOptionFrame>
              ))}
            </ProductDosageSelectorFrame>
          }
        />

        {empty ? (
          <ProductUnavailableState productName={source?.name ?? 'Product'} onNotify={() => setDialogOpen(true)} />
        ) : (
          <>
            <ProductOffersSection dosage={selectedDose}>
              <div className="ps-offer-grid">
                <div className="ps-offer-list">
                  {productVendors.map((vendor, index) => (
                    <VendorOfferCardFrame key={vendor.id}>
                      <div className={`ps-offer-heading ${selectedVendorId === vendor.id ? 'is-selected' : ''}`} onClick={() => setSelectedVendorId(vendor.id)} role="button" tabIndex={0}>
                        <div>
                          <h3>{vendor.name}</h3>
                          <p><MapPin size={14} /> {vendor.location} · {vendor.fulfillment}</p>
                        </div>
                        <button type="button" onClick={() => actions.navigate(`/vendors/${vendor.slug}`)}>
                          <Star size={15} /> {vendor.rating.toFixed(1)} <span>{vendor.reviewCount} reviews</span>
                        </button>
                      </div>
                      <div className="ps-offer-options">
                        <VendorOfferOptionFrame selected={selectedVendorId === vendor.id}>
                          <strong>10 vials</strong>
                          <span>${vendor.offerPrice.toFixed(2)}</span>
                        </VendorOfferOptionFrame>
                        <VendorOfferOptionFrame selected={false}>
                          <strong>20 vials</strong>
                          <span>${(vendor.offerPrice * 1.9).toFixed(2)}</span>
                        </VendorOfferOptionFrame>
                      </div>
                      <div className="ps-offer-facts">
                        <span><FileCheck2 size={15} /><small>Purity</small>≥{vendor.purity}%</span>
                        <span><PackageCheck size={15} /><small>Batch</small>{vendor.batch}</span>
                        <span><Truck size={15} /><small>Dispatch</small>{vendor.fulfillment}</span>
                      </div>
                      <div className="ps-offer-action">
                        <div>
                          <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label="Decrease quantity"><Minus size={15} /></button>
                          <span>{quantity}</span>
                          <button type="button" onClick={() => setQuantity((value) => value + 1)} aria-label="Increase quantity"><Plus size={15} /></button>
                        </div>
                        <button type="button" className="ps-add-to-cart-btn" onClick={() => actions.addToCart(source?.id ?? 'product-bpc-157', vendor.id)}>
                          <ShoppingBag size={17} /> Add ${(vendor.offerPrice * quantity).toFixed(2)}
                        </button>
                      </div>
                    </VendorOfferCardFrame>
                  ))}
                </div>

                {/* Cart summary card — reflects selected vendor */}
                <aside className="ps-cart-summary-card">
                  <h3>Order summary</h3>
                  <div className="ps-cart-summary-product">
                    <img src={source?.imageSrc ?? '/images/products/bpc-157.png'} alt="" />
                    <div>
                      <strong>{source?.name ?? 'Product'}</strong>
                      <span>{selectedDose} · 10-vial pack</span>
                      <small>From {selectedVendor?.name ?? '—'}</small>
                    </div>
                  </div>
                  <div className="ps-cart-summary-row">
                    <span>Unit price</span>
                    <strong>${(selectedVendor?.offerPrice ?? 0).toFixed(2)}</strong>
                  </div>
                  <div className="ps-cart-summary-row">
                    <span>Quantity</span>
                    <strong>{quantity} pack{quantity > 1 ? 's' : ''}</strong>
                  </div>
                  <div className="ps-cart-summary-divider" />
                  <div className="ps-cart-summary-total">
                    <span>Total</span>
                    <strong>${((selectedVendor?.offerPrice ?? 0) * quantity).toFixed(2)}</strong>
                  </div>
                  <button type="button" className="ps-checkout-btn" onClick={() => actions.addToCart(source?.id ?? 'product-bpc-157', selectedVendor?.id ?? 'vendor-northstar')}>
                    <ShoppingBag size={18} /> Add to cart
                  </button>
                  <div className="ps-cart-summary-badges">
                    <span><ShieldCheck size={14} /> Escrow protected</span>
                    <span><FileCheck2 size={14} /> Batch verified</span>
                  </div>
                </aside>
              </div>
            </ProductOffersSection>

            {/* COA section — show mock COAs so user can see the layout */}
            <section className="ps-product-coa-section">
              <h2><FileCheck2 size={18} /> Certificates of Analysis</h2>
              <div className="ps-coa-list">
                <div className="ps-coa-item">
                  <div><FileCheck2 size={16} /><strong>Batch {selectedVendor?.batch ?? 'PS-p1-2mg-A'}</strong></div>
                  <span>Purity: ≥{selectedVendor?.purity ?? 99.5}% · Janoshik Lab #JH-2025-0142</span>
                  <button type="button" onClick={() => actions.navigate('/coas')}>View COA <ArrowRight size={14} /></button>
                </div>
                <div className="ps-coa-item">
                  <div><FileCheck2 size={16} /><strong>Batch RX-p2-2mg-B</strong></div>
                  <span>Purity: ≥99.2% · Janoshik Lab #JH-2025-0098</span>
                  <button type="button" onClick={() => actions.navigate('/coas')}>View COA <ArrowRight size={14} /></button>
                </div>
                <div className="ps-coa-item ps-coa-pending">
                  <div><FileCheck2 size={16} /><strong>Batch AX-p3-2mg-C</strong></div>
                  <span>COA pending upload from vendor</span>
                  <button type="button" onClick={() => setDialogOpen(true)}>Notify me <Bell size={14} /></button>
                </div>
              </div>
            </section>
          </>
        )}

        <ProductAboutSection>
          <p>{details.description}</p>
          <p>Live descriptions, studies, catalog rules, and evidence links are supplied by the private application adapter.</p>
        </ProductAboutSection>
      </ProductPageFrame>

      {dialogOpen ? (
        <div className="ps-modal-backdrop" role="presentation">
          <section className="ps-modal" role="dialog" aria-modal="true" aria-label="Product alert form">
            <button type="button" className="ps-modal-close" onClick={() => setDialogOpen(false)} aria-label="Close"><X size={18} /></button>
            {submitted ? (
              <div className="ps-modal-success"><Check size={22} /><h2>Alert saved in preview</h2><p>No request was sent from this mock workspace.</p></div>
            ) : (
              <>
                <CompoundWaitlistTitle productName={source?.name ?? 'Product'} />
                <CompoundWaitlistDescription />
                <CompoundWaitlistForm
                  productName={source?.name ?? 'Product'}
                  email={email}
                  isIdle
                  onEmailChange={(event) => setEmail(event.currentTarget.value)}
                  onSubmit={(event) => { event.preventDefault(); actions.submitEmail(email, 'product-waitlist'); setSubmitted(true) }}
                />
              </>
            )}
          </section>
        </div>
      ) : null}
    </div>
  )
}

export function VendorsPage({ actions, models }: PageComponentProps) {
  const [query, setQuery] = useState('')
  const vendors = models.vendors.filter((vendor) => vendor.name.toLowerCase().includes(query.toLowerCase()))
  return (
    <div className="ps-vendors-page ps-section-shell">
      <header className="ps-page-masthead ps-page-masthead-split">
        <div><span className="ps-kicker">Marketplace partners</span><h1>Vendors</h1></div>
        <p>Compare fulfillment history, customer reviews, warehouse region, and published evidence.</p>
      </header>
      <label className="ps-directory-search"><Search size={18} /><span className="ps-visually-hidden">Search vendors</span><input value={query} onChange={(event) => setQuery(event.currentTarget.value)} placeholder="Search vendor names" /></label>
      <div className="ps-vendor-directory">
        {vendors.map((vendor, index) => <VendorRow key={vendor.id} vendor={vendor} index={index} navigate={actions.navigate} />)}
      </div>
    </div>
  )
}

function VendorRow({ vendor, index, navigate }: { vendor: VendorSummary; index: number; navigate: (href: string) => void }) {
  return (
    <FrontendLink href={`/vendors/${vendor.slug}`} navigate={navigate} className="ps-vendor-row">
      <span className="ps-vendor-rank">{String(index + 1).padStart(2, '0')}</span>
      <div className="ps-vendor-monogram">{vendor.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</div>
      <div className="ps-vendor-name"><h2>{vendor.name}</h2><p><MapPin size={14} /> {vendor.location}</p></div>
      <div className="ps-vendor-rating"><Star size={16} /><strong>{vendor.rating.toFixed(1)}</strong><span>{vendor.reviewCount} reviews</span></div>
      <div className="ps-vendor-fulfillment"><Clock3 size={15} /><span>Typical dispatch</span><strong>{vendor.fulfillment}</strong></div>
      <span className={`ps-trust-label ps-trust-${vendor.status}`}><ShieldCheck size={14} /> {vendor.status}</span>
      <ArrowRight size={19} />
    </FrontendLink>
  )
}

export function VendorPage({ actions, models, pathname }: PageComponentProps) {
  const vendor = models.vendors[0]
  const catalogMode = pathname.endsWith('/catalog')
  return (
    <div className="ps-vendor-profile ps-section-shell">
      <button type="button" className="ps-back-link" onClick={() => actions.navigate('/vendors')}><ArrowLeft size={17} /> All vendors</button>
      <header className="ps-vendor-profile-head">
        <div className="ps-vendor-profile-mark">NR</div>
        <div className="ps-vendor-profile-title">
          <span className="ps-trust-label ps-trust-trusted"><ShieldCheck size={14} /> Trusted vendor</span>
          <h1>{vendor?.name ?? 'Northstar Research'}</h1>
          <p><MapPin size={16} /> United States warehouse <span /> Active since 2024</p>
        </div>
        <div className="ps-vendor-profile-score"><strong>4.9</strong><span><Star size={16} /> 184 verified reviews</span></div>
      </header>
      <nav className="ps-subnav" aria-label="Vendor profile sections">
        <FrontendLink href="/vendors/northstar-research" navigate={actions.navigate} aria-current={!catalogMode ? 'page' : undefined}>Overview</FrontendLink>
        <FrontendLink href="/vendors/northstar-research/catalog" navigate={actions.navigate} aria-current={catalogMode ? 'page' : undefined}>Catalog</FrontendLink>
        <button type="button">COAs <span>32</span></button>
        <button type="button">Reviews <span>184</span></button>
      </nav>
      {catalogMode ? (
        <div className="ps-vendor-catalog">
          <div className="ps-vendor-catalog-head"><div><span className="ps-kicker">Vendor catalog</span><h2>Available from Northstar</h2></div><label><Search size={16} /><input placeholder="Search this catalog" /></label></div>
          <div className="ps-compact-product-list">
            {models.products.filter((product) => product.availability === 'available').slice(0, 5).map((product) => (
              <FrontendLink key={product.id} href={`/products/${product.slug}`} navigate={actions.navigate}>
                <img src={product.imageSrc} alt="" /><strong>{product.name}</strong><span>{product.formats[0]}</span><span>{product.coaCount} COAs</span><b>${product.startingPrice?.toFixed(2)}/mg</b><ArrowRight size={17} />
              </FrontendLink>
            ))}
          </div>
        </div>
      ) : (
        <div className="ps-vendor-overview-grid">
          <section className="ps-vendor-story"><span className="ps-kicker">At a glance</span><h2>Domestic fulfillment with evidence linked at the batch level.</h2><p>Northstar Research is represented here with mock content. The private application supplies the real public profile, policies, shipping regions, and marketplace history.</p><div className="ps-button-row"><FrontendLink href="/vendors/northstar-research/catalog" navigate={actions.navigate} className="ps-primary-action">View catalog <ArrowRight size={17} /></FrontendLink><button type="button"><Bell size={16} /> Follow vendor</button></div></section>
          <aside className="ps-vendor-facts"><dl><div><dt>Completed orders</dt><dd>2,310</dd></div><div><dt>On-time shipping</dt><dd>98.6%</dd></div><div><dt>Median dispatch</dt><dd>1.4 days</dd></div><div><dt>Published COAs</dt><dd>32</dd></div></dl></aside>
          <section className="ps-vendor-policy"><h2>Fulfillment notes</h2><ul><li><Truck size={17} /><div><strong>Ships from USA</strong><span>Domestic tracking supplied after dispatch.</span></div></li><li><CircleDollarSign size={17} /><div><strong>Transparent pack pricing</strong><span>Marketplace totals include PeptShop pricing rules.</span></div></li><li><FileCheck2 size={17} /><div><strong>Batch evidence</strong><span>Available certificates are attached to eligible listings.</span></div></li></ul></section>
        </div>
      )}
    </div>
  )
}
