import type { AdminPricingItem, AdminPricingVendor } from './admin-pricing'

/**
 * Presentation-only fixtures.
 *
 * These records are intentionally small, synthetic, and unrelated to private
 * marketplace records, supplier identities, commercial terms, or pricing rules.
 */
export const mockAdminPricingVendors: AdminPricingVendor[] = [
  { id: 'sample-vendor-one', name: 'Sample Vendor One', enabled: true },
  { id: 'sample-vendor-two', name: 'Sample Vendor Two', enabled: true },
  { id: 'sample-vendor-three', name: 'Sample Vendor Three', enabled: false },
]

export const mockAdminPricingItems: Array<AdminPricingItem & { vendorId: string }> = [
  {
    id: 'sample-one-compound-a',
    vendorId: 'sample-vendor-one',
    name: 'Sample Compound A',
    dosage: '5 mg, sample pack',
    outOfStock: false,
    tiers: [
      { minQty: 1, price: 20 },
      { minQty: 5, price: 18 },
    ],
  },
  {
    id: 'sample-one-compound-b',
    vendorId: 'sample-vendor-one',
    name: 'Sample Compound B',
    dosage: '10 mg, sample pack',
    outOfStock: false,
    tiers: [{ minQty: 1, price: 30 }],
  },
  {
    id: 'sample-two-compound-a',
    vendorId: 'sample-vendor-two',
    name: 'Sample Compound A',
    dosage: '5 mg, sample pack',
    outOfStock: true,
    tiers: [{ minQty: 1, price: 22 }],
  },
  {
    id: 'sample-three-compound-c',
    vendorId: 'sample-vendor-three',
    name: 'Sample Compound C',
    dosage: '2 mg, sample pack',
    outOfStock: false,
    tiers: [{ minQty: 1, price: 16 }],
  },
]
