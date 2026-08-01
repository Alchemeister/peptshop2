import type { AdminPricingItem, AdminPricingVendor } from './admin-pricing'
import type { SellerEscrowGateModel } from './seller-escrow-gate'

/**
 * Presentation-only fixtures.
 *
 * These records are intentionally small, synthetic, and unrelated to private
 * marketplace records, supplier identities, commercial terms, or pricing rules.
 */
export const mockAdminPricingVendors: AdminPricingVendor[] = [
  { id: 'vendor-northstar', name: 'Northstar Research', enabled: true },
  { id: 'vendor-retalux', name: 'Retalux', enabled: true },
  { id: 'vendor-axiom', name: 'Axiom Peptides', enabled: false },
]

export const mockAdminPricingItems: Array<AdminPricingItem & { vendorId: string }> = [
  {
    id: 'northstar-compound-a',
    vendorId: 'vendor-northstar',
    name: 'Sample Compound A',
    dosage: '5 mg, sample pack',
    outOfStock: false,
    tiers: [
      { minQty: 1, price: 20 },
      { minQty: 5, price: 18 },
    ],
  },
  {
    id: 'northstar-compound-b',
    vendorId: 'vendor-northstar',
    name: 'Sample Compound B',
    dosage: '10 mg, sample pack',
    outOfStock: false,
    tiers: [{ minQty: 1, price: 30 }],
  },
  {
    id: 'retalux-compound-a',
    vendorId: 'vendor-retalux',
    name: 'Sample Compound A',
    dosage: '5 mg, sample pack',
    outOfStock: true,
    tiers: [{ minQty: 1, price: 22 }],
  },
  {
    id: 'axiom-compound-c',
    vendorId: 'vendor-axiom',
    name: 'Sample Compound C',
    dosage: '2 mg, sample pack',
    outOfStock: false,
    tiers: [{ minQty: 1, price: 16 }],
  },
]

export const mockSellerEscrowGateModel: SellerEscrowGateModel = {
  badge: 'Sample account paused',
  headline: 'Choose an escrow level to continue',
  lead: 'This is an illustrative presentation state. The private application supplies localized terms and decides whether a vendor can continue.',
  options: [
    {
      tier: 'EXEMPT',
      percentage: 0,
      title: 'No escrow',
      bullets: [
        'No vendor proceeds are held in escrow.',
        'Normal settlement timing still applies.',
        'Unavailable stores stop accepting new orders.',
      ],
      ctaLabel: 'Choose 0% escrow',
      pendingLabel: 'Selecting…',
    },
    {
      tier: 'STANDARD',
      percentage: 15,
      title: 'Standard escrow',
      bullets: [
        'A portion of each order is held temporarily.',
        'Held funds release after the fulfillment window.',
        'The configured weekly volume cap applies.',
      ],
      detail: {
        label: 'Sample weekly volume cap',
        value: '$5,000',
        caption: '$1,800 used in the sample period · $3,200 remaining',
      },
      ctaLabel: 'Choose 15% escrow',
      pendingLabel: 'Selecting…',
    },
    {
      tier: 'EXTENDED',
      percentage: 50,
      title: 'Extended escrow',
      description: 'Higher escrow in exchange for unlimited weekly volume.',
      bullets: [
        'Half of the vendor cost is held per order.',
        'The weekly volume cap is removed.',
        'Held funds release after the fulfillment window.',
      ],
      notice: 'This sample selection is shown as permanent.',
      ctaLabel: 'Choose 50% escrow',
      pendingLabel: 'Selecting…',
      requiresConfirmation: true,
    },
  ],
  confirmation: {
    prompt: 'The live host treats the 50% selection as permanent. Confirm the sample interaction?',
    confirmLabel: 'Confirm 50%',
    pendingLabel: 'Confirming…',
    cancelLabel: 'Cancel',
  },
  failureLabel: 'The sample action could not be completed.',
  offboardNote:
    'In production, vendors who do not select an option can contact operations to begin offboarding.',
}
