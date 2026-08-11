import type { ReactNode } from 'react'

export type FrontendTheme = 'light' | 'dark'

export type ProductSummary = {
  id: string
  name: string
  slug: string
  category: string
  formats: string[]
  regions?: Array<'us' | 'eu' | 'cn'>
  startingPrice: number | null
  priceUnit?: string
  packSize?: number
  vendorCount: number
  coaCount: number
  imageSrc: string
  availability: 'available' | 'watchlist'
  popularity?: number
}

export type VendorSummary = {
  id: string
  name: string
  slug: string
  location: string
  rating: number
  reviewCount: number
  orderCount: number
  fulfillment: string
  fulfillmentHours?: number | null
  coaCount?: number
  recommendationScore?: number
  acceptsOrders?: boolean
  regions?: Array<'us' | 'eu' | 'cn'>
  specialties: string[]
  status: 'trusted' | 'verified' | 'new'
  verified?: boolean
  shippingCost?: number
  shippingBenefit?: number
}

export type CoaSummary = {
  id: string
  product: string
  vendor: string
  lab: string
  batch: string
  testedAt: string
  purity: string
  result: 'pass' | 'review'
  href?: string
}

export type CartLine = {
  id: string
  product: string
  format: string
  vendor: string
  vendorId?: string
  quantity: number
  unitPrice: number
  imageSrc: string
  shippingCost?: number
}

export type OrderDisplayStatus =
  | 'accepted'
  | 'cancelled'
  | 'delivered'
  | 'paid'
  | 'payment_pending'
  | 'refunded'
  | 'review'
  | 'shipped'

export type OrderSummary = {
  destination?: string
  events?: Array<{
    at: string
    status: OrderDisplayStatus
  }>
  id: string
  itemSummary?: string
  number: string
  customer: string
  total: number
  status: OrderDisplayStatus
  updatedAt: string
  vendor?: string
}

export type SellerMetric = {
  label: string
  value: string
  detail: string
}

export type PeptShopViewModels = {
  products: ProductSummary[]
  vendors: VendorSummary[]
  coas: CoaSummary[]
  cart: CartLine[]
  lastOrderTotal: number | null
  orders: OrderSummary[]
  sellerMetrics: SellerMetric[]
  directoryShipping?: {
    href: string
    label: string
  }
}

export type PeptShopActions = {
  navigate: (href: string) => void
  searchProducts: (query: string) => void
  addToCart: (productId: string, vendorId?: string, vendorName?: string, unitPrice?: number, format?: string, shippingCost?: number) => void
  updateCartQuantity: (lineId: string, quantity: number) => void
  removeCartLine: (lineId: string) => void
  clearCart: () => void
  beginCheckout: () => void
  submitCheckout: (form: HTMLFormElement) => void
  submitEmail: (email: string, intent: string) => void
  submitLogin: (email: string) => void
  submitCoa: (form: HTMLFormElement) => void
  verifyBatch: (batch: string) => void
  createVendor: (form: HTMLFormElement) => void
  sellerAction: (action: string, id?: string) => void
  adminAction: (action: string, id?: string) => void
}

export type PageComponentProps = {
  actions: PeptShopActions
  models: PeptShopViewModels
  pathname: string
  query: URLSearchParams
  theme: FrontendTheme
}

export type SlotProps = {
  children: ReactNode
  className?: string
}

export const noopActions: PeptShopActions = {
  navigate: () => undefined,
  searchProducts: () => undefined,
  addToCart: () => undefined,
  updateCartQuantity: () => undefined,
  removeCartLine: () => undefined,
  clearCart: () => undefined,
  beginCheckout: () => undefined,
  submitCheckout: () => undefined,
  submitEmail: () => undefined,
  submitLogin: () => undefined,
  submitCoa: () => undefined,
  verifyBatch: () => undefined,
  createVendor: () => undefined,
  sellerAction: () => undefined,
  adminAction: () => undefined,
}
