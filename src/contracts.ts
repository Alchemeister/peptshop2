import type { ReactNode } from 'react'

export type FrontendTheme = 'light' | 'dark'

/** Vial color presets — maps to cap/content colors in VialImage component */
export type VialColorKey =
  | 'blue'      // standard peptides (BPC-157, TB-500, etc.)
  | 'red'       // tissue repair / healing
  | 'amber'     // NAD+, glutathione, metabolic (powder)
  | 'green'     // growth hormone secretagogues
  | 'purple'    // GLP-1 agonists
  | 'cyan'      // neurological
  | 'clear'     // BAC water, acetic acid (liquid)
  | 'gold'      // growth factors

export type ProductSummary = {
  id: string
  name: string
  slug: string
  category: string
  formats: string[]
  startingPrice: number | null
  vendorCount: number
  coaCount: number
  imageSrc: string
  availability: 'available' | 'watchlist'
  vialColor?: VialColorKey
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
  specialties: string[]
  status: 'trusted' | 'verified' | 'new'
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
}

export type CartLine = {
  id: string
  product: string
  format: string
  vendor: string
  quantity: number
  unitPrice: number
  imageSrc: string
  vialColor?: VialColorKey
}

export type OrderSummary = {
  id: string
  number: string
  customer: string
  total: number
  status: 'paid' | 'review' | 'shipped' | 'delivered'
  updatedAt: string
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
  orders: OrderSummary[]
  sellerMetrics: SellerMetric[]
}

export type PeptShopActions = {
  navigate: (href: string) => void
  searchProducts: (query: string) => void
  addToCart: (productId: string, vendorId?: string) => void
  updateCartQuantity: (lineId: string, quantity: number) => void
  removeCartLine: (lineId: string) => void
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
