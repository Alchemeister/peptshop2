import {
  ArrowLeft,
  ArrowRight,
  Bell,
  FileCheck2,
  MapPin,
  Minus,
  PackageCheck,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
} from 'lucide-react'
import { type KeyboardEvent, type ReactNode, useEffect, useMemo, useState } from 'react'
import { researchStudies, type ResearchStudy } from './mock-data'
import {
  ProductBackControlFrame,
  ProductDosageOptionFrame,
  ProductDosageSelectorFrame,
  ProductOffersSection,
  ProductPageFrame,
  ProductPageHero,
  type ProductPageTheme,
  ProductUnavailableState,
  VendorOfferCardFrame,
  VendorOfferOptionFrame,
} from './product-page'

export type ProductMarketplaceAction =
  | { kind: 'cart'; label?: string }
  | { kind: 'notify'; label: string }
  | { kind: 'disabled'; label: string }

export type ProductMarketplaceOption = {
  action: ProductMarketplaceAction
  batchLabel?: string | null
  batchVerified?: boolean
  coaHref?: string | null
  coaLabel?: string | null
  dispatchLabel?: string | null
  escrowProtected?: boolean
  id: string
  label: string
  price: number
  pricePerUnitLabel?: string | null
  purityLabel?: string | null
}

export type ProductMarketplaceOffer = {
  fulfillment?: string | null
  id: string
  location?: string | null
  options: ProductMarketplaceOption[]
  rating?: number | null
  reviewCount?: number | null
  statusLabel?: string | null
  vendorId?: string | null
  vendorName: string
  verified?: boolean
}

export type ProductMarketplaceDosage = {
  id: string
  label: string
  offers: ProductMarketplaceOffer[]
  selectorLabel?: ReactNode
}

export type ProductMarketplaceModel = {
  cas?: string | null
  compoundUnavailable?: boolean
  dosageLabel: string
  dosages: ProductMarketplaceDosage[]
  formula?: string | null
  id: string
  mw?: string | null
  name: string
  overview?: string | null
  showAvailabilityNotice?: boolean
  slug?: string
}

export type ProductMarketplaceSelection = {
  dosage: ProductMarketplaceDosage
  offer: ProductMarketplaceOffer
  option: ProductMarketplaceOption
  quantity: number
}

type ProductMarketplaceViewProps = {
  children?: ReactNode
  initialDosageId?: string | null
  model: ProductMarketplaceModel
  onBack: () => void
  onBatch?: (selection: ProductMarketplaceSelection) => void
  onCoa?: (selection: ProductMarketplaceSelection) => void
  onDosageChange?: (dosageId: string) => void
  onNotifyCompound: () => void
  onPrimaryAction: (selection: ProductMarketplaceSelection) => void
  onReviewVendor?: (offer: ProductMarketplaceOffer) => void
  selectedDosageId?: string | null
  theme?: ProductPageTheme
}

const clampQuantity = (value: number) => Math.min(99, Math.max(1, value))

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    currency: 'USD',
    style: 'currency',
  }).format(value)

export function ProductMarketplaceView({
  children,
  initialDosageId = null,
  model,
  onBack,
  onBatch,
  onCoa,
  onDosageChange,
  onNotifyCompound,
  onPrimaryAction,
  onReviewVendor,
  selectedDosageId,
  theme = 'light',
}: ProductMarketplaceViewProps) {
  const defaultDosageId =
    initialDosageId && model.dosages.some((dosage) => dosage.id === initialDosageId)
      ? initialDosageId
      : (model.dosages[1]?.id ?? model.dosages[0]?.id ?? '')
  const [internalDosageId, setInternalDosageId] = useState(defaultDosageId)
  const activeDosageId = selectedDosageId ?? internalDosageId
  const activeDosage =
    model.dosages.find((dosage) => dosage.id === activeDosageId) ?? model.dosages[0] ?? null
  const [selectedOfferId, setSelectedOfferId] = useState('')
  const [selectedOptionId, setSelectedOptionId] = useState('')
  const [quantity, setQuantity] = useState(1)

  const selectedOffer =
    activeDosage?.offers.find((offer) => offer.id === selectedOfferId) ??
    activeDosage?.offers[0] ??
    null
  const selectedOption =
    selectedOffer?.options.find((option) => option.id === selectedOptionId) ??
    selectedOffer?.options[0] ??
    null

  useEffect(() => {
    if (!activeDosage) return
    if (selectedDosageId === undefined && activeDosage.id !== internalDosageId) {
      setInternalDosageId(activeDosage.id)
    }
    if (!activeDosage.offers.some((offer) => offer.id === selectedOfferId)) {
      setSelectedOfferId(activeDosage.offers[0]?.id ?? '')
      setSelectedOptionId(activeDosage.offers[0]?.options[0]?.id ?? '')
      setQuantity(1)
    }
  }, [activeDosage, internalDosageId, selectedDosageId, selectedOfferId])

  useEffect(() => {
    if (!selectedOffer) return
    if (!selectedOffer.options.some((option) => option.id === selectedOptionId)) {
      setSelectedOptionId(selectedOffer.options[0]?.id ?? '')
      setQuantity(1)
    }
  }, [selectedOffer, selectedOptionId])

  const selection = useMemo<ProductMarketplaceSelection | null>(() => {
    if (!activeDosage || !selectedOffer || !selectedOption) return null
    return {
      dosage: activeDosage,
      offer: selectedOffer,
      option: selectedOption,
      quantity,
    }
  }, [activeDosage, quantity, selectedOffer, selectedOption])

  const chooseDosage = (dosageId: string) => {
    if (dosageId === activeDosage?.id) return
    if (selectedDosageId === undefined) {
      setInternalDosageId(dosageId)
    }
    setSelectedOfferId('')
    setSelectedOptionId('')
    setQuantity(1)
    onDosageChange?.(dosageId)
  }

  const chooseOffer = (offer: ProductMarketplaceOffer) => {
    if (offer.id === selectedOffer?.id) return
    setSelectedOfferId(offer.id)
    setSelectedOptionId(offer.options[0]?.id ?? '')
    setQuantity(1)
  }

  const chooseOfferFromKeyboard = (
    event: KeyboardEvent<HTMLDivElement>,
    offer: ProductMarketplaceOffer,
  ) => {
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    chooseOffer(offer)
  }

  const chooseOption = (offer: ProductMarketplaceOffer, option: ProductMarketplaceOption) => {
    if (offer.id === selectedOffer?.id && option.id === selectedOption?.id) return
    setSelectedOfferId(offer.id)
    setSelectedOptionId(option.id)
    setQuantity(1)
  }

  const triggerPrimaryAction = (
    offer: ProductMarketplaceOffer,
    option: ProductMarketplaceOption,
  ) => {
    if (!activeDosage || option.action.kind === 'disabled') return
    onPrimaryAction({
      dosage: activeDosage,
      offer,
      option,
      quantity: offer.id === selectedOffer?.id ? quantity : 1,
    })
  }

  const hasOffers = Boolean(activeDosage && activeDosage.offers.length > 0)
  const showUnavailable = model.compoundUnavailable || model.showAvailabilityNotice || !hasOffers
  const showOffers = !model.compoundUnavailable && hasOffers

  return (
    <div className="ps-product-route">
      <ProductPageFrame theme={theme}>
        <ProductPageHero
          productName={model.name}
          dosageLabel={model.dosageLabel}
          cas={model.cas}
          formula={model.formula}
          mw={model.mw}
          overview={model.overview}
          backControl={
            <ProductBackControlFrame>
              <button type="button" aria-label="Return to catalog" onClick={onBack}>
                <ArrowLeft size={20} strokeWidth={1.8} />
              </button>
            </ProductBackControlFrame>
          }
          dosageSelector={
            <ProductDosageSelectorFrame>
              {model.dosages.map((dosage) => (
                <ProductDosageOptionFrame
                  key={dosage.id}
                  selected={dosage.id === activeDosage?.id}
                  onClick={() => chooseDosage(dosage.id)}
                >
                  {dosage.selectorLabel ?? dosage.label}
                </ProductDosageOptionFrame>
              ))}
            </ProductDosageSelectorFrame>
          }
        />

        {showUnavailable ? (
          <ProductUnavailableState productName={model.name} onNotify={onNotifyCompound} />
        ) : null}

        {showOffers && activeDosage ? (
          <ProductOffersSection dosage={activeDosage.label}>
            <div className="ps-offer-grid">
              <div className="ps-offer-list">
                {activeDosage.offers.map((offer) => {
                  const offerSelected = offer.id === selectedOffer?.id
                  const activeOption =
                    offer.options.find((option) => option.id === selectedOptionId) ??
                    offer.options[0] ??
                    null
                  const offerQuantity = offerSelected ? quantity : 1

                  return (
                    <VendorOfferCardFrame key={offer.id} data-product-offer-id={offer.id}>
                      <div
                        className={`ps-offer-heading ${offerSelected ? 'is-selected' : ''}`}
                        role="button"
                        tabIndex={0}
                        onClick={() => chooseOffer(offer)}
                        onKeyDown={(event) => chooseOfferFromKeyboard(event, offer)}
                      >
                        <div className="ps-offer-vendor-info">
                          <h3>
                            {offer.vendorName}
                            {offer.verified ? (
                              <span
                                className="ps-verified-badge"
                                role="img"
                                aria-label="Admin-verified vendor"
                              >
                                <ShieldCheck size={15} />
                              </span>
                            ) : null}
                            {offer.rating !== null && offer.rating !== undefined ? (
                              <span className="ps-offer-rating">
                                <Star size={15} /> {offer.rating.toFixed(1)}
                              </span>
                            ) : null}
                          </h3>
                          <p>
                            <MapPin size={14} />
                            {[offer.location, offer.fulfillment].filter(Boolean).join(' · ') ||
                              offer.statusLabel ||
                              'Fulfillment details pending'}
                          </p>
                          {offer.statusLabel ? (
                            <small className="ps-offer-status">{offer.statusLabel}</small>
                          ) : null}
                        </div>
                        {onReviewVendor ? (
                          <button
                            type="button"
                            className="ps-offer-coa-link"
                            onClick={(event) => {
                              event.stopPropagation()
                              onReviewVendor(offer)
                            }}
                          >
                            Reviews
                          </button>
                        ) : null}
                      </div>

                      <div className="ps-offer-options">
                        {offer.options.map((option) => (
                          <VendorOfferOptionFrame
                            key={option.id}
                            selected={offerSelected && option.id === selectedOption?.id}
                            onClick={() => chooseOption(offer, option)}
                          >
                            <strong>{option.label}</strong>
                            <span>{formatCurrency(option.price)}</span>
                            {option.pricePerUnitLabel ? (
                              <small>{option.pricePerUnitLabel}</small>
                            ) : null}
                          </VendorOfferOptionFrame>
                        ))}
                      </div>

                      {activeOption ? (
                        <div className="ps-offer-facts">
                          <span>
                            <FileCheck2 size={15} />
                            <small>Purity</small>
                            {activeOption.purityLabel || '—'}
                          </span>
                          <span>
                            <PackageCheck size={15} />
                            <small>Batch</small>
                            {onBatch && activeOption.batchLabel ? (
                              <button
                                type="button"
                                className="ps-offer-inline-link"
                                onClick={() =>
                                  activeDosage &&
                                  onBatch({
                                    dosage: activeDosage,
                                    offer,
                                    option: activeOption,
                                    quantity: offerQuantity,
                                  })
                                }
                              >
                                {activeOption.batchLabel}
                              </button>
                            ) : (
                              activeOption.batchLabel || '—'
                            )}
                          </span>
                          <span>
                            <Truck size={15} />
                            <small>Dispatch</small>
                            {activeOption.dispatchLabel || offer.fulfillment || 'Pending'}
                          </span>
                          {activeOption.coaHref || onCoa ? (
                            activeOption.coaHref ? (
                              <a
                                className="ps-offer-coa-link"
                                href={activeOption.coaHref}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <FileCheck2 size={13} /> {activeOption.coaLabel || 'COA'}
                              </a>
                            ) : (
                              <button
                                type="button"
                                className="ps-offer-coa-link"
                                onClick={() =>
                                  activeDosage &&
                                  onCoa?.({
                                    dosage: activeDosage,
                                    offer,
                                    option: activeOption,
                                    quantity: offerQuantity,
                                  })
                                }
                              >
                                <FileCheck2 size={13} /> {activeOption.coaLabel || 'COA'}
                              </button>
                            )
                          ) : null}
                        </div>
                      ) : null}

                      {activeOption ? (
                        <div className="ps-offer-action">
                          <div>
                            <button
                              type="button"
                              aria-label="Decrease quantity"
                              disabled={activeOption.action.kind !== 'cart' || offerQuantity <= 1}
                              onClick={() => {
                                chooseOffer(offer)
                                setQuantity((value) => clampQuantity(value - 1))
                              }}
                            >
                              <Minus size={15} />
                            </button>
                            <span>{offerQuantity}</span>
                            <button
                              type="button"
                              aria-label="Increase quantity"
                              disabled={activeOption.action.kind !== 'cart' || offerQuantity >= 99}
                              onClick={() => {
                                chooseOffer(offer)
                                setQuantity((value) => clampQuantity(value + 1))
                              }}
                            >
                              <Plus size={15} />
                            </button>
                          </div>
                          <button
                            type="button"
                            className="ps-add-to-cart-btn"
                            disabled={activeOption.action.kind === 'disabled'}
                            onClick={() => triggerPrimaryAction(offer, activeOption)}
                          >
                            {activeOption.action.kind === 'cart' ? (
                              <>
                                <ShoppingBag size={17} />{' '}
                                {activeOption.action.label ||
                                  `Add ${formatCurrency(activeOption.price * offerQuantity)}`}
                              </>
                            ) : (
                              <>
                                <Bell size={17} /> {activeOption.action.label}
                              </>
                            )}
                          </button>
                        </div>
                      ) : null}
                    </VendorOfferCardFrame>
                  )
                })}
              </div>

              {selection ? (
                <aside className="ps-cart-summary-card">
                  <h3>Order summary</h3>
                  <div className="ps-cart-summary-product">
                    <div>
                      <strong>{model.name}</strong>
                      <span>
                        {selection.dosage.label} · {selection.option.label}
                      </span>
                      <small>From {selection.offer.vendorName}</small>
                    </div>
                  </div>
                  <div className="ps-cart-summary-row">
                    <span>Unit price</span>
                    <strong>{formatCurrency(selection.option.price)}</strong>
                  </div>
                  <div className="ps-cart-summary-row">
                    <span>Quantity</span>
                    <strong>
                      {selection.quantity} pack{selection.quantity === 1 ? '' : 's'}
                    </strong>
                  </div>
                  <div className="ps-cart-summary-divider" />
                  <div className="ps-cart-summary-total">
                    <span>Total</span>
                    <strong>{formatCurrency(selection.option.price * selection.quantity)}</strong>
                  </div>
                  {selection.option.escrowProtected || selection.option.batchVerified ? (
                    <div className="ps-cart-summary-badges">
                      {selection.option.escrowProtected ? (
                        <span>
                          <ShieldCheck size={14} /> Escrow protected
                        </span>
                      ) : null}
                      {selection.option.batchVerified ? (
                        <span>
                          <FileCheck2 size={14} /> Batch verified
                        </span>
                      ) : null}
                    </div>
                  ) : null}
                </aside>
              ) : null}
            </div>
          </ProductOffersSection>
        ) : null}

        {model.slug ? (
          <ResearchLibrarySection slug={model.slug} productName={model.name} />
        ) : null}

        {children}
      </ProductPageFrame>
    </div>
  )
}

function ResearchLibrarySection({ slug, productName }: { slug: string; productName: string }) {
  const studies: ResearchStudy[] = researchStudies[slug] ?? []
  const [expanded, setExpanded] = useState(false)
  const visibleCount = expanded ? studies.length : Math.min(studies.length, 5)
  const visible = studies.slice(0, visibleCount)

  if (studies.length === 0) return null

  return (
    <section className="ps-research-library" aria-labelledby="ps-research-library-heading">
      <div className="ps-research-library-header">
        <span className="ps-kicker">Research Library</span>
        <h2 id="ps-research-library-heading">Latest Research News</h2>
        <p className="ps-research-library-subtitle">
          Peer-reviewed studies and publications referencing {productName}.
        </p>
      </div>
      <div className="ps-research-study-list">
        {visible.map((study) => (
          <article key={study.id} className="ps-research-study-card">
            <div className="ps-research-study-card-main">
              <h3 className="ps-research-study-title">{study.title}</h3>
              <div className="ps-research-study-meta">
                <span className="ps-research-study-date">{study.date}</span>
                <span className="ps-research-study-authors">{study.authors}</span>
              </div>
            </div>
            <a
              href={study.url}
              className="ps-research-study-open"
              target="_blank"
              rel="noopener noreferrer"
            >
              {study.url.startsWith('https://pubmed') ? 'PubMed' : 'Open'}
              <ArrowRight size={14} strokeWidth={1.8} />
            </a>
          </article>
        ))}
      </div>
      {studies.length > 5 && (
        <button
          type="button"
          className="ps-research-show-more"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Show less' : `Show ${studies.length - 5} more`}
        </button>
      )}
    </section>
  )
}
