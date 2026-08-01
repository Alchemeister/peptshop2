import { Check, Star, TrendingUp, X, FileCheck2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { PageComponentProps } from '../contracts'
import { type ProductMarketplaceModel, type ProductMarketplaceOffer, ProductMarketplaceView } from '../product-marketplace-view'
import {
  CompoundWaitlistDescription,
  CompoundWaitlistForm,
  CompoundWaitlistTitle,
} from '../product-page'
import { productDetails, generateReviews } from './market-pages'

const parseProductName = (pathname: string) => {
  const routePrefixes = ['/catalog/', '/products/', '/peptides/']
  const prefix = routePrefixes.find((candidate) => pathname.includes(candidate))
  if (!prefix) return ''

  return decodeURIComponent(pathname.split(prefix)[1]?.split('?')[0] ?? '')
}

export function ProductMarketplacePage({
  actions,
  models,
  query,
  theme,
  pathname,
}: PageComponentProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [reviewVendor, setReviewVendor] = useState<{ name: string; slug: string; rating: number; reviewCount: number; verified: boolean } | null>(null)
  const [reviewTab, setReviewTab] = useState<'reviews' | 'coas'>('reviews')
  const productName = parseProductName(pathname)
  const source =
    models.products.find(
      (product) => product.name === productName || product.slug === productName,
    ) ??
    models.products.find((product) => product.name === 'BPC-157') ??
    models.products[0]
  const details = productDetails[source?.name ?? ''] ?? {
    cas: 'Pending',
    description:
      'Research compound available from vetted suppliers with transparent per-mg pricing and batch-level evidence.',
    formula: 'Pending',
    mw: 'Pending',
  }
  const dosageLabels = source?.formats ?? ['2 mg', '5 mg', '10 mg']

  const model = useMemo<ProductMarketplaceModel>(() => {
    const productVendors = models.vendors.slice(
      0,
      Math.max(1, Math.min(source?.vendorCount ?? 1, models.vendors.length)),
    )
    const priceMultipliers: Record<string, number> = {
      'vendor-axiom': 0.94,
      'vendor-northstar': 1,
      'vendor-retalux': 1.08,
      'vendor-sample-zero': 0.85,
    }
    const vendorBatchPrefix: Record<string, string> = {
      'vendor-axiom': 'AX',
      'vendor-northstar': 'NS',
      'vendor-retalux': 'RX',
      'vendor-sample-zero': 'SZ',
    }
    const vendorPurity: Record<string, number> = {
      'vendor-axiom': 99.1,
      'vendor-northstar': 99.2,
      'vendor-retalux': 99,
      'vendor-sample-zero': 99,
    }
    const lookupVendorPrice = (dose: string, vendorId: string) => {
      const doseValue = Number.parseInt(dose, 10) || 5
      const baseDose = Number.parseInt(dosageLabels[0] ?? '', 10) || 5
      const basePrice = Math.max(1, source?.startingPrice ?? 20)
      return (
        Math.round(
          basePrice * Math.max(1, doseValue / baseDose) * (priceMultipliers[vendorId] ?? 1) * 100,
        ) / 100
      )
    }

    return {
      cas: details.cas,
      compoundUnavailable:
        query.get('state') === 'empty' ||
        source?.availability === 'watchlist' ||
        (source?.vendorCount === 0 && source?.availability !== 'available'),
      dosageLabel: 'Dose per vial',
      dosages: dosageLabels.map((dose) => ({
        id: dose,
        label: dose,
        offers: productVendors.map((vendor) => {
          const tenPackPrice = lookupVendorPrice(dose, vendor.id)
          const doseValue = Number.parseInt(dose, 10) || 5
          const batchLetter = String.fromCharCode(65 + (doseValue % 26))
          const sharedOption = {
            action: { kind: 'cart' as const },
            batchLabel: `${vendorBatchPrefix[vendor.id] ?? 'QA'}-${doseValue}mg-${batchLetter}`,
            batchVerified: true,
            coaLabel: 'COA',
            dispatchLabel: vendor.fulfillment,
            escrowProtected: true,
            purityLabel: `≥${vendorPurity[vendor.id] ?? 99}%`,
          }

          return {
            fulfillment: vendor.fulfillment,
            id: `${dose}-${vendor.id}`,
            location: vendor.location || 'Location pending',
            options: [
              {
                ...sharedOption,
                id: `${dose}-${vendor.id}-10`,
                label: '10 vials',
                price: tenPackPrice,
                pricePerUnitLabel: `$${(tenPackPrice / (doseValue * 10)).toFixed(2)}/mg`,
              },
              {
                ...sharedOption,
                id: `${dose}-${vendor.id}-20`,
                label: '20 vials',
                price: tenPackPrice * 1.9,
                pricePerUnitLabel: `$${((tenPackPrice * 1.9) / (doseValue * 20)).toFixed(2)}/mg`,
              },
            ],
            rating: vendor.rating,
            reviewCount: vendor.reviewCount,
            vendorId: vendor.id,
            vendorName: vendor.name,
            verified: vendor.status === 'trusted',
          }
        }),
      })),
      formula: details.formula,
      id: source?.id ?? 'product-bpc-157',
      mw: details.mw,
      name: source?.name ?? 'Product',
      overview: details.description,
      slug: source?.slug,
    }
  }, [details, dosageLabels, models.vendors, query, source])

  return (
    <ProductMarketplaceView
      model={model}
      initialDosageId={model.dosages[1]?.id ?? model.dosages[0]?.id}
      onBack={() => actions.navigate('/products')}
      onCoa={(selection) =>
        actions.navigate(
          `/coas?vendor=${encodeURIComponent(selection.offer.vendorName)}&product=${encodeURIComponent(model.name)}`,
        )
      }
      onNotifyCompound={() => setDialogOpen(true)}
      onPrimaryAction={(selection) =>
        actions.addToCart(
          model.id,
          selection.offer.vendorId ?? undefined,
          selection.offer.vendorName,
          selection.option.price * selection.quantity,
          `${selection.dosage.label} · ${selection.option.label}`,
        )
      }
      onReviewVendor={(offer) => {
        const vendor = models.vendors.find((v) => v.id === offer.vendorId || v.name === offer.vendorName)
        setReviewVendor({
          name: offer.vendorName,
          slug: vendor?.slug ?? encodeURIComponent(offer.vendorId ?? offer.id),
          rating: offer.rating ?? vendor?.rating ?? 4.8,
          reviewCount: offer.reviewCount ?? vendor?.reviewCount ?? 0,
          verified: Boolean(offer.verified),
        })
      }}
      theme={theme}
    >
      {dialogOpen ? (
        <div className="ps-modal-backdrop" role="presentation">
          <section
            className="ps-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Product alert form"
          >
            <button
              type="button"
              className="ps-modal-close"
              onClick={() => setDialogOpen(false)}
              aria-label="Close"
            >
              <X size={18} />
            </button>
            {submitted ? (
              <div className="ps-modal-success">
                <Check size={22} />
                <h2>Alert saved</h2>
                <p>We'll notify you when this compound becomes available from new vendors.</p>
              </div>
            ) : (
              <>
                <CompoundWaitlistTitle productName={model.name} />
                <CompoundWaitlistDescription />
                <CompoundWaitlistForm
                  productName={model.name}
                  email={email}
                  isIdle
                  onEmailChange={(event) => setEmail(event.currentTarget.value)}
                  onSubmit={(event) => {
                    event.preventDefault()
                    actions.submitEmail(email, 'product-waitlist')
                    setSubmitted(true)
                  }}
                />
              </>
            )}
          </section>
        </div>
      ) : null}
      {reviewVendor ? (
        <div className="ps-modal-backdrop" role="presentation" onClick={() => setReviewVendor(null)}>
          <section className="ps-modal ps-review-modal" role="dialog" aria-modal="true" aria-label={`Reviews for ${reviewVendor.name}`} onClick={(e) => e.stopPropagation()}>
            <button type="button" className="ps-modal-close" onClick={() => setReviewVendor(null)} aria-label="Close"><X size={18} /></button>
            <div className="ps-review-modal-header">
              <span className="ps-kicker">Vendor</span>
              <h2>{reviewVendor.name} {reviewVendor.verified ? <Check size={18} /> : null}</h2>
            </div>
            <div className="ps-review-modal-metrics">
              <div className="ps-review-metric-card">
                <div className="ps-review-metric-label"><Star size={15} /> Average Rating</div>
                <strong>{reviewVendor.rating.toFixed(1)}</strong>
                <span>{reviewVendor.reviewCount} total reviews</span>
              </div>
              <div className="ps-review-metric-card">
                <div className="ps-review-metric-label"><TrendingUp size={15} /> Recommendation Rate</div>
                <strong>96%</strong>
                <span>Based on verified purchases</span>
              </div>
            </div>
            <div className="ps-review-modal-tabs">
              <button type="button" className={`ps-review-tab ${reviewTab === 'reviews' ? 'is-active' : ''}`} onClick={() => setReviewTab('reviews')}>Customer Reviews</button>
              <button type="button" className={`ps-review-tab ${reviewTab === 'coas' ? 'is-active' : ''}`} onClick={() => setReviewTab('coas')}>Certificates of Analysis</button>
            </div>
            <div className="ps-review-modal-content">
              {reviewTab === 'reviews' ? (
                <>
                  <div className="ps-review-dist">
                    {[5, 4, 3, 2, 1].map((s) => {
                      const pct = s === 5 ? 78 : s === 4 ? 14 : s === 3 ? 5 : s === 2 ? 2 : 1
                      return (
                        <div key={s} className="ps-review-dist-row">
                          <span>{s}★</span>
                          <div className="ps-review-dist-bar"><div className="ps-review-dist-fill" style={{ width: `${pct}%` }} /></div>
                          <small>{pct}%</small>
                        </div>
                      )
                    })}
                  </div>
                  <div className="ps-review-list ps-review-list-full">
                    {generateReviews(reviewVendor.reviewCount || 5).slice(0, 5).map((rev, i) => (
                      <div key={i} className="ps-review-item">
                        <div className="ps-review-head">
                          <strong>{rev.buyer}</strong>
                          <span>{'★'.repeat(rev.stars)}{'☆'.repeat(5 - rev.stars)}</span>
                        </div>
                        <p>{rev.text}</p>
                        <small>{rev.date} · Verified purchase</small>
                      </div>
                    ))}
                  </div>
                  <button type="button" className="ps-review-modal-all" onClick={() => { actions.navigate(`/vendors/${reviewVendor.slug}/reviews`); setReviewVendor(null) }}>
                    View all {reviewVendor.reviewCount} reviews
                  </button>
                </>
              ) : (
                <div className="ps-review-coa-list">
                  {models.products.filter((p) => p.availability === 'available').slice(0, 6).map((p, i) => (
                    <div key={i} className="ps-review-coa-item">
                      <FileCheck2 size={16} />
                      <div>
                        <strong>{p.name}</strong>
                        <span>Batch {p.slug.toUpperCase()}-{(i + 1).toString().padStart(2, '0')} · Purity ≥{(99 - i * 0.2).toFixed(1)}%</span>
                      </div>
                      <button type="button" className="ps-review-coa-link" onClick={() => { actions.navigate(`/coas?vendor=${encodeURIComponent(reviewVendor.name)}&product=${encodeURIComponent(p.name)}`); setReviewVendor(null) }}>View COA</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      ) : null}
    </ProductMarketplaceView>
  )
}
