import type { AdminPricingItem, AdminPricingVendor } from './admin-pricing'

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
