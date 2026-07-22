'use client'

import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronUp,
  CircleAlert,
  PackageOpen,
  Plus,
  Save,
  Search,
  Trash2,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import styles from './admin-pricing.module.css'

export type AdminPricingTier = {
  minQty: number
  price: number
}

export type AdminPricingVendor = {
  id: string
  name: string
  enabled: boolean
}

export type AdminPricingItem = {
  id: string
  name: string
  dosage: string
  outOfStock: boolean
  tiers: AdminPricingTier[]
}

export type AdminPricingSaveInput = {
  vendorId: string
  itemId: string
  tiers: AdminPricingTier[]
  outOfStock: boolean
}

export type AdminPricingSaveResult = {
  ok: boolean
  message: string
}

export type AdminPricingSurfaceProps = {
  vendors: AdminPricingVendor[]
  selectedVendorId?: string
  items: AdminPricingItem[]
  loadError?: string | null
  vendorLoading?: boolean
  onBack: () => void
  onAddVendor: () => void
  onSelectVendor: (vendorId: string) => void
  onSave: (input: AdminPricingSaveInput) => Promise<AdminPricingSaveResult>
}

type TierDraft = {
  minQty: string
  price: string
}

const toDraft = (tier: AdminPricingTier): TierDraft => ({
  minQty: String(tier.minQty),
  price: String(tier.price),
})

const priceLabel = (tiers: AdminPricingTier[]) => {
  const baseTier = [...tiers].sort((a, b) => a.minQty - b.minQty)[0]
  return baseTier ? `$${baseTier.price.toFixed(2)}` : 'Not set'
}

function PricingRow({
  item,
  vendorId,
  onSave,
}: {
  item: AdminPricingItem
  vendorId: string
  onSave: AdminPricingSurfaceProps['onSave']
}) {
  const [expanded, setExpanded] = useState(false)
  const [tiers, setTiers] = useState<TierDraft[]>(() => item.tiers.map(toDraft))
  const [outOfStock, setOutOfStock] = useState(item.outOfStock)
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState<AdminPricingSaveResult | null>(null)

  const updateTier = (index: number, field: keyof TierDraft, value: string) => {
    setTiers((current) =>
      current.map((tier, tierIndex) =>
        tierIndex === index ? { ...tier, [field]: value } : tier,
      ),
    )
    setFeedback(null)
  }

  const addTier = () => {
    setTiers((current) => {
      const previous = current.at(-1)
      const previousQuantity = Number(previous?.minQty)
      return [
        ...current,
        {
          minQty: String(Number.isFinite(previousQuantity) ? previousQuantity + 1 : 1),
          price: previous?.price ?? '',
        },
      ]
    })
    setFeedback(null)
  }

  const removeTier = (index: number) => {
    setTiers((current) => current.filter((_, tierIndex) => tierIndex !== index))
    setFeedback(null)
  }

  const save = async () => {
    const parsedTiers = tiers.map((tier) => ({
      minQty: Number(tier.minQty),
      price: Number(tier.price),
    }))
    const incomplete =
      parsedTiers.length === 0 ||
      parsedTiers.some(
        (tier, index) =>
          tiers[index]?.minQty.trim() === '' ||
          tiers[index]?.price.trim() === '' ||
          !Number.isFinite(tier.minQty) ||
          !Number.isFinite(tier.price),
      )

    if (incomplete) {
      setFeedback({ ok: false, message: 'Complete every quantity and price before saving.' })
      return
    }

    setSaving(true)
    setFeedback(null)
    try {
      const result = await onSave({
        vendorId,
        itemId: item.id,
        tiers: parsedTiers,
        outOfStock,
      })
      setFeedback(result)
    } catch {
      setFeedback({ ok: false, message: 'Pricing could not be saved. Please try again.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <article className={styles.item}>
      <div className={styles.itemSummary}>
        <div className={styles.compound}>
          <strong>{item.name}</strong>
          <span>{item.dosage || 'Dosage not set'}</span>
        </div>
        <div className={styles.basePrice}>
          <span>Base price</span>
          <strong>{priceLabel(item.tiers)}</strong>
        </div>
        <div className={styles.tierCount}>
          <span>Volume tiers</span>
          <strong>{item.tiers.length}</strong>
        </div>
        <span className={item.outOfStock ? styles.stockPaused : styles.stockLive}>
          {item.outOfStock ? 'Unavailable' : 'Available'}
        </span>
        <button
          type="button"
          className={styles.editButton}
          onClick={() => {
            setExpanded((current) => !current)
            setFeedback(null)
          }}
          aria-expanded={expanded}
          aria-controls={`pricing-editor-${item.id}`}
        >
          {expanded ? 'Close' : 'Edit'}
          {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </button>
      </div>

      {expanded ? (
        <div className={styles.editor} id={`pricing-editor-${item.id}`}>
          <div className={styles.editorIntro}>
            <div>
              <h3>Price tiers</h3>
              <p>The first tier starts at one unit. Later tiers set volume pricing.</p>
            </div>
            <label className={styles.stockToggle}>
              <input
                type="checkbox"
                checked={outOfStock}
                onChange={(event) => {
                  setOutOfStock(event.currentTarget.checked)
                  setFeedback(null)
                }}
              />
              <span>Mark unavailable</span>
            </label>
          </div>

          <div className={styles.tierTable}>
            <div className={styles.tierHeader} aria-hidden="true">
              <span>Minimum quantity</span>
              <span>Unit price</span>
              <span />
            </div>
            {tiers.map((tier, index) => (
              <div className={styles.tierRow} key={`${item.id}-tier-${index}`}>
                <label>
                  <span>Minimum quantity</span>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    inputMode="numeric"
                    value={tier.minQty}
                    onChange={(event) => updateTier(index, 'minQty', event.currentTarget.value)}
                    aria-label={`Minimum quantity for tier ${index + 1}`}
                  />
                </label>
                <label>
                  <span>Unit price</span>
                  <div className={styles.currencyInput}>
                    <span>$</span>
                    <input
                      type="number"
                      min="0"
                      max="999"
                      step="0.01"
                      inputMode="decimal"
                      value={tier.price}
                      onChange={(event) => updateTier(index, 'price', event.currentTarget.value)}
                      aria-label={`Unit price for tier ${index + 1}`}
                    />
                  </div>
                </label>
                <button
                  type="button"
                  className={styles.removeTier}
                  onClick={() => removeTier(index)}
                  aria-label={`Remove tier ${index + 1}`}
                  disabled={tiers.length === 1}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <div className={styles.editorActions}>
            <button type="button" className={styles.addTier} onClick={addTier} disabled={tiers.length >= 12}>
              <Plus size={15} /> Add tier
            </button>
            <div className={styles.saveGroup}>
              {feedback ? (
                <p className={feedback.ok ? styles.success : styles.error} role="status">
                  {feedback.ok ? <Check size={15} /> : <CircleAlert size={15} />}
                  {feedback.message}
                </p>
              ) : null}
              <button
                type="button"
                className={styles.saveButton}
                onClick={save}
                disabled={saving || tiers.length === 0}
                aria-busy={saving}
              >
                <Save size={15} /> {saving ? 'Saving' : 'Save pricing'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </article>
  )
}

export function AdminPricingSurface({
  vendors,
  selectedVendorId,
  items,
  loadError = null,
  vendorLoading = false,
  onBack,
  onAddVendor,
  onSelectVendor,
  onSave,
}: AdminPricingSurfaceProps) {
  const [query, setQuery] = useState('')
  const selectedVendor = vendors.find((vendor) => vendor.id === selectedVendorId) ?? vendors[0]
  const normalizedQuery = query.trim().toLowerCase()
  const visibleItems = useMemo(
    () =>
      normalizedQuery
        ? items.filter((item) =>
            `${item.name} ${item.dosage}`.toLowerCase().includes(normalizedQuery),
          )
        : items,
    [items, normalizedQuery],
  )

  return (
    <section className={styles.root} aria-busy={vendorLoading}>
      <header className={styles.masthead}>
        <div className={styles.mastheadInner}>
          <button type="button" className={styles.backButton} onClick={onBack}>
            <ArrowLeft size={16} /> Admin
          </button>
          <div className={styles.titleBlock}>
            <p>Catalog controls</p>
            <h1>Pricing and availability</h1>
            <span>Set vendor price tiers and storefront availability from one guarded workspace.</span>
          </div>
          {vendors.length > 0 ? (
            <label className={styles.vendorSelect}>
              <span>Vendor</span>
              <select
                value={selectedVendor?.id ?? ''}
                onChange={(event) => onSelectVendor(event.currentTarget.value)}
                disabled={vendorLoading}
              >
                {vendors.map((vendor) => (
                  <option key={vendor.id} value={vendor.id}>
                    {vendor.name}{vendor.enabled ? '' : ' (disabled)'}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
        </div>
      </header>

      <div className={styles.workspace}>
        {loadError ? (
          <div className={styles.loadError} role="alert">
            <CircleAlert size={18} />
            <div>
              <strong>Catalog controls are temporarily unavailable</strong>
              <p>{loadError}</p>
            </div>
          </div>
        ) : vendors.length === 0 ? (
          <div className={styles.emptyState}>
            <PackageOpen size={25} />
            <h2>Add a vendor first</h2>
            <p>Pricing is attached to vendor catalog listings. Create the first vendor to continue.</p>
            <button type="button" onClick={onAddVendor}>
              <Plus size={16} /> Add vendor
            </button>
          </div>
        ) : (
          <>
            <div className={styles.toolbar}>
              <div>
                <h2>{selectedVendor?.name ?? 'Vendor catalog'}</h2>
                <p>{items.length} catalog {items.length === 1 ? 'listing' : 'listings'}</p>
              </div>
              <label className={styles.searchBox}>
                <Search size={16} aria-hidden="true" />
                <span className={styles.visuallyHidden}>Search catalog</span>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.currentTarget.value)}
                  placeholder="Search compound or dosage"
                />
              </label>
            </div>

            {items.length === 0 ? (
              <div className={styles.emptyState}>
                <PackageOpen size={25} />
                <h2>No catalog listings yet</h2>
                <p>This vendor can add listings from the seller portal. They will appear here automatically.</p>
              </div>
            ) : visibleItems.length === 0 ? (
              <div className={styles.emptyState}>
                <Search size={24} />
                <h2>No matching listings</h2>
                <p>Try a compound name or dosage from this vendor catalog.</p>
              </div>
            ) : (
              <div className={styles.list}>
                <div className={styles.listHeader} aria-hidden="true">
                  <span>Compound</span>
                  <span>Base price</span>
                  <span>Volume tiers</span>
                  <span>Availability</span>
                  <span />
                </div>
                {visibleItems.map((item) => (
                  <PricingRow
                    key={`${item.id}:${item.outOfStock}:${JSON.stringify(item.tiers)}`}
                    item={item}
                    vendorId={selectedVendor?.id ?? ''}
                    onSave={onSave}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
