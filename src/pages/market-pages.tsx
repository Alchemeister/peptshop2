import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
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
import { useEffect, useMemo, useState } from 'react'
import type { PageComponentProps, ProductSummary, VendorSummary } from '../contracts'
import { mockAdminPricingItems, mockProduct, mockVendor } from '../mock-data'
import { FrontendLink } from '../navigation'
import {
  CompoundWaitlistDescription,
  CompoundWaitlistForm,
  CompoundWaitlistTitle,
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
  const [stockOnly, setStockOnly] = useState(true)
  const [regionFilter, setRegionFilter] = useState<'all' | 'us' | 'eu'>('all')
  const [regionOpen, setRegionOpen] = useState(false)
  const [sortBy, setSortBy] = useState<'name' | 'price-low' | 'price-high'>('name')
  const [showTop, setShowTop] = useState(false)
  const visibleProducts = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    const filtered = models.products.filter((product) => {
      if (stockOnly && (product.availability !== 'available' || product.vendorCount === 0)) return false
      if (regionFilter === 'eu' && product.vendorCount < 3) return false // EU = Axiom (3rd vendor)
      return !normalized || `${product.name} ${product.category}`.toLowerCase().includes(normalized)
    })
    return filtered.sort((left, right) => {
      if (sortBy === 'price-low') return (left.startingPrice ?? 999) - (right.startingPrice ?? 999)
      if (sortBy === 'price-high') return (right.startingPrice ?? 0) - (left.startingPrice ?? 0)
      return left.name.localeCompare(right.name)
    })
  }, [models.products, query, stockOnly, sortBy, regionFilter])

  const groupedProducts = useMemo(() => {
    const groups = new Map<string, ProductSummary[]>()
    for (const product of visibleProducts) {
      const list = groups.get(product.category)
      if (list) list.push(product)
      else groups.set(product.category, [product])
    }
    return [...groups.entries()].sort(([a], [b]) => a.localeCompare(b))
  }, [visibleProducts])

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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
        <div className={`ps-region-dropdown ${regionOpen ? 'is-open' : ''}`}>
          <button
            type="button"
            className={`ps-region-trigger ${regionFilter !== 'all' ? 'is-active' : ''}`}
            onClick={() => setRegionOpen((open) => !open)}
            aria-expanded={regionOpen}
          >
            <MapPin size={15} />
            {regionFilter === 'all' ? 'All regions' : regionFilter === 'us' ? 'US warehouse' : 'EU warehouse'}
            <ChevronDown size={15} />
          </button>
          {regionOpen ? (
            <>
              <div className="ps-region-overlay" onClick={() => setRegionOpen(false)} />
              <div className="ps-region-menu">
                <button type="button" className={regionFilter === 'all' ? 'is-selected' : ''} onClick={() => { setRegionFilter('all'); setRegionOpen(false) }}>
                  <Check size={15} /> All regions
                </button>
                <button type="button" className={regionFilter === 'us' ? 'is-selected' : ''} onClick={() => { setRegionFilter('us'); setRegionOpen(false) }}>
                  <Check size={15} /> US warehouse
                </button>
                <button type="button" className={regionFilter === 'eu' ? 'is-selected' : ''} onClick={() => { setRegionFilter('eu'); setRegionOpen(false) }}>
                  <Check size={15} /> EU warehouse
                </button>
              </div>
            </>
          ) : null}
        </div>
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
          <button type="button" className={sortBy === 'name' ? 'is-active' : ''} onClick={() => setSortBy('name')}>Sort <span>A–Z</span></button>
          <button type="button" className={sortBy === 'price-low' ? 'is-active' : ''} onClick={() => setSortBy('price-low')}>Price <span>Low–High</span></button>
          <button type="button" className={sortBy === 'price-high' ? 'is-active' : ''} onClick={() => setSortBy('price-high')}>Price <span>High–Low</span></button>
        </div>
      ) : null}

      {visibleProducts.length ? (
        <>
        {groupedProducts.length > 1 ? (
          <nav className="ps-catalog-category-nav" aria-label="Categories">
            {groupedProducts.map(([category]) => (
              <a key={category} href={`#cat-${category.replace(/\s+/g, '-').toLowerCase()}`}>{category}</a>
            ))}
          </nav>
        ) : null}
        <div className="ps-catalog-groups" style={{ marginTop: '1.5rem' }}>
          {groupedProducts.map(([category, products]) => (
            <section key={category} id={`cat-${category.replace(/\s+/g, '-').toLowerCase()}`} className="ps-catalog-group">
              <div className="ps-catalog-group-head">
                <span className="ps-kicker">{category}</span>
                <span className="ps-catalog-group-count">{products.length} {products.length === 1 ? 'compound' : 'compounds'}</span>
              </div>
              <div className="ps-catalog-grid">
                {products.map((product) => (
                  <CatalogCard key={product.id} product={product} navigate={actions.navigate} />
                ))}
              </div>
            </section>
          ))}
        </div>
        </>
      ) : (
        <div className="ps-empty-state">
          <Search size={24} />
          <h2>No matching compounds</h2>
          <p>Try a shorter name or clear the availability filter.</p>
          <button type="button" onClick={() => { setQuery(''); setStockOnly(false) }}>Reset catalog</button>
        </div>
      )}
      {showTop ? (
        <button type="button" className="ps-back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top">
          <ArrowUp size={20} />
        </button>
      ) : null}
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
        {product.coaCount === 0 ? <small className="ps-catalog-card-disclaimer">*Illustrative</small> : null}
      </div>
      <div className="ps-catalog-card-copy">
        <h2>{product.name}</h2>
        <p>{product.formats.join(' · ')}</p>
        <div>
          <span>{product.vendorCount ? `${product.vendorCount} vendors` : 'Join watchlist'}</span>
          {product.vendorCount >= 3 ? <small className="ps-region-badge">US · EU</small> : product.vendorCount >= 1 ? <small className="ps-region-badge">US</small> : null}
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
  '5-Amino-1MQ': { cas: '4142-44-3', formula: 'C11H17N5O', description: 'Small molecule inhibitor of NAD-dependent methyltransferase. Research suggests metabolic regulation and potential anti-obesity effects via NNMT inhibition.' },
  'ACE-031': { cas: 'N/A', formula: 'Recombinant protein', description: 'Recombinant fusion protein of activin receptor type IIB. Research suggests muscle growth stimulation via myostatin blockade.' },
  'Acetic Acid': { cas: '64-19-7', formula: 'CH3COOH', description: 'Reconstitution solvent for peptide vials. 0.9% bacteriostatic acetic acid for compounds sensitive to neutral pH.' },
  'BAC Water': { cas: 'N/A', formula: 'H2O + 0.9% BA', description: 'Bacteriostatic water for injection. 0.9% benzyl alcohol preservative allows multi-dose use for up to 30 days.' },
  'Cagrilintide': { cas: '2210613-36-6', formula: 'C242H355N61O68', description: 'Long-acting amylin analog. Research suggests appetite suppression and weight loss as a dual-action with GLP-1 agonists.' },
  'Dihexa': { cas: '127892-62-8', formula: 'C22H28N6O3', description: 'Angiotensin IV analog. Research suggests cognitive enhancement and neuroprotective effects via dendritic spine growth.' },
  'DSIP': { cas: '62568-57-4', formula: 'C34H41N7O9', description: 'Delta sleep-inducing peptide. Research suggests regulation of sleep cycles, stress response, and hormone modulation.' },

  'Follistatin-344': { cas: 'N/A', formula: 'Recombinant protein', description: 'Recombinant glycoprotein. Research suggests muscle growth via myostatin and activin binding inhibition.' },
  'GHRP-2': { cas: '158861-67-7', formula: 'C45H55N9O6', description: 'Growth hormone secretagogue. Research stimulates GH release via ghrelin receptor agonism.' },
  'Glutathione': { cas: '70-18-8', formula: 'C10H17N3O6S', description: 'Tripeptide antioxidant. Research suggests detoxification, immune support, and oxidative stress reduction.' },
  'Gonadorelin': { cas: '33515-09-2', formula: 'C55H15N17O13', description: 'Synthetic GnRH analog. Research suggests reproductive hormone regulation and fertility applications.' },
  'IGF-1 LR3': { cas: '14325-99-2', formula: 'C331H521N77O113S6', description: 'Long-acting insulin-like growth factor analog. Research suggests muscle growth, recovery, and neuroprotection.' },
  'Kisspeptin-10': { cas: '374679-61-3', formula: 'C54H84N15O11', description: 'Neuropeptide derived from kisspeptin. Research suggests reproductive hormone regulation and pubertal activation.' },
  'Liraglutide': { cas: '204656-20-2', formula: 'C97H149N21O33', description: 'GLP-1 receptor agonist. Research suggests glycemic control and weight loss for type 2 diabetes management.' },
  'MOD-GRF 1-29': { cas: '93414-79-4', formula: 'C74H117N27O22', description: 'Modified growth hormone releasing factor analog. Research suggests sustained GH release and IGF-1 elevation.' },
  'Oxytocin': { cas: '50-56-6', formula: 'C43H66N12O12S2', description: 'Neurohypophysial hormone. Research suggests social bonding, trust, and potential therapeutic uses for autism spectrum.' },
  'PEG-MGF': { cas: 'N/A', formula: 'C102H184N34O40S8 (PEGylated)', description: 'Pegylated mechano growth factor. Research suggests muscle repair, recovery, and satellite cell activation.' },
  'Pinealon': { cas: 'N/A', formula: 'C15H25N5O7', description: 'Synthetic tripeptide. Research suggests cognitive protection and neuroregeneration via brain-specific gene regulation.' },
  'Selank': { cas: '129954-34-3', formula: 'C69H104N22O19S', description: 'Synthetic heptapeptide. Research suggests anxiolytic and cognitive enhancement effects via immune modulation.' },
  'Semax': { cas: '80715-95-1', formula: 'C40H63N15O11S', description: 'Synthetic heptapeptide. Research suggests cognitive enhancement, memory improvement, and neuroprotective effects.' },
  'Sermorelin': { cas: '31231-80-8', formula: 'C24H34N12O6', description: 'Growth hormone releasing hormone analog. Research suggests GH stimulation and anti-aging applications.' },
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
  const details = productDetails[source?.name ?? ''] ?? { cas: 'N/A', formula: 'N/A', description: 'Research compound available from vetted suppliers with transparent per-mg pricing and batch-level evidence.' }
  const dosages = source?.formats ?? ['2 mg', '5 mg', '10 mg']

  // Build vendor offers from mock vendors, priced per product
  // Look up actual admin pricing for per-dose prices
  const lookupAdminPrice = (dose: string, vendorMultiplier = 1): number => {
    const doseNum = parseInt(dose) || 5
    const adminItem = mockAdminPricingItems.find(
      (item) => item.name === source?.name && (
        item.dosage.includes(`${doseNum} mg`) ||
        item.dosage.includes(`${doseNum} mL`) ||
        item.dosage.includes(`${doseNum}mg`) ||
        item.dosage.includes(`${doseNum}mL`)
      )
    )
    if (adminItem && adminItem.tiers[0]) {
      return adminItem.tiers[0].price * vendorMultiplier
    }
    // Fallback to startingPrice if no admin match
    return (source?.startingPrice ?? 42) * vendorMultiplier
  }

  const productVendors = useMemo(() => {
    const vendorData = [
      { id: 'vendor-northstar', name: 'Northstar Research', slug: 'northstar-research', location: 'United States', rating: 4.9, reviewCount: 184, coaCount: 32, fulfillment: '1–2 days', purity: 99.5, batch: 'PS-p1-2mg-A', offerPrice: source?.startingPrice ?? 42 } as any,
      { id: 'vendor-retalux', name: 'Retalux', slug: 'retalux', location: 'United States', rating: 4.8, reviewCount: 142, coaCount: 24, fulfillment: '2–3 days', purity: 99.2, batch: 'RX-p2-2mg-B', offerPrice: (source?.startingPrice ?? 42) * 1.05 } as any,
      { id: 'vendor-axiom', name: 'Axiom Peptides', slug: 'axiom-peptides', location: 'European Union', rating: 4.7, reviewCount: 98, coaCount: 15, fulfillment: '3–5 days', purity: 99.0, batch: 'AX-p3-2mg-C', offerPrice: (source?.startingPrice ?? 42) * 0.85 } as any,
    ]
    return vendorData.slice(0, Math.max(1, source?.vendorCount ?? 1))
  }, [source])

  const [selectedDose, setSelectedDose] = useState(dosages[1] ?? dosages[0])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [selectedVendorId, setSelectedVendorId] = useState(productVendors[0]?.id ?? '')
  const [selectedPackSize, setSelectedPackSize] = useState<10 | 20>(10)
  const empty = query.get('state') === 'empty'
  const selectedVendor = productVendors.find((v) => v.id === selectedVendorId) ?? productVendors[0]

  // Get price from admin pricing data based on selected dose
  const vendorMult = selectedVendor?.id === 'vendor-retalux' ? 1.05
    : selectedVendor?.id === 'vendor-axiom' ? 0.85
    : 1
  const dosePrice = lookupAdminPrice(selectedDose, vendorMult)
  const unitPrice = selectedPackSize === 20
    ? dosePrice * 1.9
    : dosePrice

  return (
    <div className="ps-product-route">
      <ProductPageFrame theme={theme}>
        <ProductPageHero
          productName={source?.name ?? 'Product'}
          dosageLabel="Dose per vial"
          cas={details.cas}
          formula={details.formula}
          overview={details.description}
          imageSrc={source?.imageSrc ?? '/vial.svg'}
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
                          <p><MapPin size={14} /> {vendor.location || 'Location pending'} · {vendor.fulfillment}</p>
                        </div>
                        <button type="button" onClick={(e) => { e.stopPropagation(); actions.navigate(`/vendors/${vendor.slug}`) }}>
                          <Star size={15} /> {vendor.rating.toFixed(1)} <span>{vendor.reviewCount} reviews</span>
                        </button>
                      </div>
                      <div className="ps-offer-options">
                        {(() => {
                          const vMult = vendor.id === 'vendor-retalux' ? 1.05 : vendor.id === 'vendor-axiom' ? 0.85 : 1
                          const vPrice = lookupAdminPrice(selectedDose, vMult)
                          return (<>
                        <VendorOfferOptionFrame selected={selectedVendorId === vendor.id && selectedPackSize === 10} onClick={() => { setSelectedVendorId(vendor.id); setSelectedPackSize(10) }}>
                          <strong>10 vials</strong>
                          <span>${vPrice.toFixed(2)}</span>
                        </VendorOfferOptionFrame>
                        <VendorOfferOptionFrame selected={selectedVendorId === vendor.id && selectedPackSize === 20} onClick={() => { setSelectedVendorId(vendor.id); setSelectedPackSize(20) }}>
                          <strong>20 vials</strong>
                          <span>${(vPrice * 1.9).toFixed(2)}</span>
                        </VendorOfferOptionFrame>
                        </>); })()}
                      </div>
                      <div className="ps-offer-facts">
                        <span><FileCheck2 size={15} /><small>Purity</small>≥{vendor.purity}%</span>
                        <span><PackageCheck size={15} /><small>Batch</small>{vendor.batch}</span>
                        <span><Truck size={15} /><small>Dispatch</small>{vendor.fulfillment}</span>
                        <button type="button" className="ps-offer-coa-link" onClick={() => actions.navigate('/coas')}>
                          <FileCheck2 size={13} /> COA
                        </button>
                      </div>
                      <div className="ps-offer-action">
                        <div>
                          <button type="button" onClick={() => { setSelectedVendorId(vendor.id); setQuantity((value) => Math.max(1, value - 1)) }} aria-label="Decrease quantity"><Minus size={15} /></button>
                          <span>{selectedVendorId === vendor.id ? quantity : 1}</span>
                          <button type="button" onClick={() => { setSelectedVendorId(vendor.id); setQuantity((value) => value + 1) }} aria-label="Increase quantity"><Plus size={15} /></button>
                        </div>
                        <button type="button" className="ps-add-to-cart-btn" onClick={() => { setSelectedVendorId(vendor.id); actions.addToCart(source?.id ?? 'product-bpc-157', vendor.id) }}>
                          <ShoppingBag size={17} /> Add ${(() => {
                            const vMult = vendor.id === 'vendor-retalux' ? 1.05 : vendor.id === 'vendor-axiom' ? 0.85 : 1
                            const vPrice = lookupAdminPrice(selectedDose, vMult)
                            return ((selectedPackSize === 20 ? vPrice * 1.9 : vPrice) * (selectedVendorId === vendor.id ? quantity : 1)).toFixed(2)
                          })()}
                        </button>
                      </div>
                    </VendorOfferCardFrame>
                  ))}
                </div>

                {/* Cart summary card — reflects selected vendor */}
                <aside className="ps-cart-summary-card">
                  <h3>Order summary</h3>
                  <div className="ps-cart-summary-product">
                    <img src={source?.imageSrc ?? '/vial.svg'} alt="" />
                    <div>
                      <strong>{source?.name ?? 'Product'}</strong>
                      <span>{selectedDose} · {selectedPackSize}-vial pack</span>
                      <small>From {selectedVendor?.name ?? '—'}</small>
                    </div>
                  </div>
                  <div className="ps-cart-summary-row">
                    <span>Unit price</span>
                    <strong>${unitPrice.toFixed(2)}</strong>
                  </div>
                  <div className="ps-cart-summary-row">
                    <span>Quantity</span>
                    <strong>{quantity} pack{quantity > 1 ? 's' : ''}</strong>
                  </div>
                  <div className="ps-cart-summary-divider" />
                  <div className="ps-cart-summary-total">
                    <span>Total</span>
                    <strong>${(unitPrice * quantity).toFixed(2)}</strong>
                  </div>
                  <div className="ps-cart-summary-badges">
                    <span><ShieldCheck size={14} /> Escrow protected</span>
                    <span><FileCheck2 size={14} /> Batch verified</span>
                  </div>
                </aside>
              </div>
            </ProductOffersSection>

            {/* COA section — per-vendor, per-compound */}
            <section className="ps-product-coa-section">
              <h2><FileCheck2 size={18} /> Certificates of Analysis · {source?.name ?? 'Product'}</h2>
              <div className="ps-coa-list">
                {productVendors.map((vendor) => (
                  <div key={vendor.id} className="ps-coa-item">
                    <div>
                      <FileCheck2 size={16} />
                      <div>
                        <strong>{vendor.name} — Batch {vendor.batch}</strong>
                        <small style={{ display: 'block', color: 'var(--ps-muted)', fontSize: '0.75rem' }}>Purity ≥{vendor.purity}% · {source?.name ?? 'BPC-157'} · {selectedDose}</small>
                      </div>
                    </div>
                    <span>Janoshik Lab #{vendor.id === 'vendor-northstar' ? 'JH-2025-0142' : vendor.id === 'vendor-retalux' ? 'JH-2025-0098' : 'Pending'}</span>
                    {vendor.id === 'vendor-axiom' ? (
                      <button type="button" onClick={() => setDialogOpen(true)}><Bell size={14} /> Notify me</button>
                    ) : (
                      <button type="button" onClick={() => actions.navigate('/coas')}>View COA <ArrowRight size={14} /></button>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </ProductPageFrame>

      {dialogOpen ? (
        <div className="ps-modal-backdrop" role="presentation">
          <section className="ps-modal" role="dialog" aria-modal="true" aria-label="Product alert form">
            <button type="button" className="ps-modal-close" onClick={() => setDialogOpen(false)} aria-label="Close"><X size={18} /></button>
            {submitted ? (
              <div className="ps-modal-success"><Check size={22} /><h2>Alert saved</h2><p>We'll notify you when this compound becomes available from new vendors.</p></div>
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
      <section className="ps-vendor-page-summary">
        <div>
          <span className="ps-kicker">Marketplace standards</span>
          <h2>Every vendor vetted. Every batch verified.</h2>
          <p>All vendors on PeptShop undergo identity verification before listing. Each product listing links to batch-level certificates of analysis from independent labs. Buyers can verify purity, identity, and lab records before purchase.</p>
        </div>
        <dl>
          <div><dt>Total vendors</dt><dd>{models.vendors.length}</dd></div>
          <div><dt>Total COAs published</dt><dd>{models.vendors.reduce((sum, v) => sum + ((v as any)?.coaCount ?? 0), 0)}</dd></div>
          <div><dt>Average rating</dt><dd>{(models.vendors.reduce((sum, v) => sum + v.rating, 0) / Math.max(1, models.vendors.length)).toFixed(1)}★</dd></div>
          <div><dt>Total reviews</dt><dd>{models.vendors.reduce((sum, v) => sum + v.reviewCount, 0).toLocaleString()}</dd></div>
        </dl>
      </section>
    </div>
  )
}

function VendorRow({ vendor, index, navigate }: { vendor: VendorSummary; index: number; navigate: (href: string) => void }) {
  return (
    <FrontendLink href={`/vendors/${vendor.slug}`} navigate={navigate} className="ps-vendor-row">
      <span className="ps-vendor-rank">{String(index + 1).padStart(2, '0')}</span>
      <div className="ps-vendor-monogram">{vendor.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</div>
      <div className="ps-vendor-name"><h2>{vendor.name}</h2><p><MapPin size={14} /> {vendor.location || 'Location pending'}</p></div>
      <div className="ps-vendor-rating"><Star size={16} /><strong>{vendor.rating.toFixed(1)}</strong><span>{vendor.reviewCount} reviews</span></div>
      <div className="ps-vendor-fulfillment"><Clock3 size={15} /><span>Typical dispatch</span><strong>{vendor.fulfillment}</strong></div>
      <span className={`ps-trust-label ps-trust-${vendor.status}`}><ShieldCheck size={14} /> {vendor.status}</span>
      <ArrowRight size={19} />
    </FrontendLink>
  )
}

export function VendorPage({ actions, models, pathname }: PageComponentProps) {
  // Extract vendor slug from URL
  const slug = decodeURIComponent(pathname.split('/vendors/')[1]?.split('/')[0] ?? '')
  const vendor = models.vendors.find((v) => v.slug === slug) ?? models.vendors[0]
  const catalogMode = pathname.endsWith('/catalog')
  const vendorInitials = vendor?.name?.split(' ').map((part) => part[0]).join('').slice(0, 2) ?? 'NR'
  return (
    <div className="ps-vendor-profile ps-section-shell">
      <button type="button" className="ps-back-link" onClick={() => actions.navigate('/vendors')}><ArrowLeft size={17} /> All vendors</button>
      <header className="ps-vendor-profile-head">
        <div className={`ps-vendor-profile-mark`}>{vendorInitials}</div>
        <div className="ps-vendor-profile-title">
          <span className="ps-trust-label ps-trust-trusted"><ShieldCheck size={14} /> Trusted vendor</span>
          <h1>{vendor?.name ?? 'Northstar Research'}</h1>
          <p><MapPin size={16} /> {vendor?.location ?? 'United States'} warehouse <span /> Active since 2024</p>
        </div>
        <div className="ps-vendor-profile-score"><strong>{vendor?.rating?.toFixed(1) ?? '4.9'}</strong><span><Star size={16} /> {vendor?.reviewCount ?? 184} verified reviews</span></div>
      </header>
      <nav className="ps-subnav" aria-label="Vendor profile sections">
        <FrontendLink href={`/vendors/${vendor?.slug ?? 'northstar-research'}`} navigate={actions.navigate} aria-current={!catalogMode ? 'page' : undefined}>Overview</FrontendLink>
        <FrontendLink href={`/vendors/${vendor?.slug ?? 'northstar-research'}/catalog`} navigate={actions.navigate} aria-current={catalogMode ? 'page' : undefined}>Catalog</FrontendLink>
        <button type="button">COAs <span>{(vendor as any)?.coaCount ?? 0}</span></button>
        <button type="button">Reviews <span>{vendor?.reviewCount ?? 0}</span></button>
      </nav>
      {catalogMode ? (
        <div className="ps-vendor-catalog">
          <div className="ps-vendor-catalog-head"><div><span className="ps-kicker">Vendor catalog</span><h2>Available from {vendor?.name ?? 'Vendor'}</h2></div><label><Search size={16} /><input placeholder="Search this catalog" /></label></div>
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
          <section className="ps-vendor-story"><span className="ps-kicker">At a glance</span><h2>{vendor?.location ?? 'US'} fulfillment with evidence linked at the batch level.</h2><p>{vendor?.name ?? 'This vendor'} ships from {vendor?.location ?? 'the US'} with {vendor?.fulfillment ?? '1–2 day'} dispatch. All listings include batch-level COA evidence.</p><div className="ps-button-row"><FrontendLink href={`/vendors/${vendor?.slug ?? 'northstar-research'}/catalog`} navigate={actions.navigate} className="ps-primary-action">View catalog <ArrowRight size={17} /></FrontendLink><button type="button"><Bell size={16} /> Follow vendor</button></div></section>
          <aside className="ps-vendor-facts"><dl><div><dt>Completed orders</dt><dd>{vendor?.orderCount?.toLocaleString() ?? '2,310'}</dd></div><div><dt>On-time shipping</dt><dd>98.6%</dd></div><div><dt>Median dispatch</dt><dd>{vendor?.fulfillment ?? '1–2 days'}</dd></div><div><dt>Published COAs</dt><dd>{(vendor as any)?.coaCount ?? 0}</dd></div></dl></aside>
          <section className="ps-vendor-policy"><h2>Fulfillment notes</h2><ul><li><Truck size={17} /><div><strong>Ships from {vendor?.location ?? 'USA'}</strong><span>Tracking supplied after dispatch.</span></div></li><li><CircleDollarSign size={17} /><div><strong>Transparent pack pricing</strong><span>Marketplace totals include PeptShop pricing rules.</span></div></li><li><FileCheck2 size={17} /><div><strong>Batch evidence</strong><span>Available certificates are attached to eligible listings.</span></div></li></ul></section>
        </div>
      )}
    </div>
  )
}
