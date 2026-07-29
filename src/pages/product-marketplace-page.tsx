import { Check, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { PageComponentProps } from '../contracts'
import { type ProductMarketplaceModel, ProductMarketplaceView } from '../product-marketplace-view'
import {
  CompoundWaitlistDescription,
  CompoundWaitlistForm,
  CompoundWaitlistTitle,
} from '../product-page'
import { productDetails } from './market-pages'

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
    }
    const vendorBatchPrefix: Record<string, string> = {
      'vendor-axiom': 'AX',
      'vendor-northstar': 'NS',
      'vendor-retalux': 'RX',
    }
    const vendorPurity: Record<string, number> = {
      'vendor-axiom': 99.1,
      'vendor-northstar': 99.2,
      'vendor-retalux': 99,
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
              },
              {
                ...sharedOption,
                id: `${dose}-${vendor.id}-20`,
                label: '20 vials',
                price: tenPackPrice * 1.9,
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
      onReviewVendor={(offer) =>
        actions.navigate(`/vendors/${encodeURIComponent(offer.vendorId ?? offer.id)}/reviews`)
      }
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
    </ProductMarketplaceView>
  )
}
