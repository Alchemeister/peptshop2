export type RouteFamily =
  | 'home'
  | 'catalog'
  | 'product'
  | 'vendors'
  | 'vendor'
  | 'evidence'
  | 'commerce'
  | 'orders'
  | 'content'
  | 'library'
  | 'auth'
  | 'seller'
  | 'admin'
  | 'staff'
  | 'affiliate'
  | 'api'

export type RouteAccess = 'public' | 'link' | 'seller' | 'admin' | 'staff'

export type RouteDefinition = {
  family: RouteFamily
  access: RouteAccess
  label: string
  paths: string[]
}

export const excludedRoutes = [
  '/group-testing',
  '/group-testing/*',
  '/rfq',
  '/rfq/*',
  '/pools',
  '/pools/*',
] as const

export const routeManifest: RouteDefinition[] = [
  { family: 'home', access: 'public', label: 'Homepage', paths: ['/'] },
  {
    family: 'catalog',
    access: 'public',
    label: 'Catalog',
    paths: ['/products', '/peptides'],
  },
  {
    family: 'product',
    access: 'public',
    label: 'Product detail',
    paths: ['/catalog/:name', '/products/:slug', '/product/:id', '/peptides/:slug'],
  },
  { family: 'vendors', access: 'public', label: 'Vendor directory', paths: ['/vendors'] },
  {
    family: 'vendor',
    access: 'public',
    label: 'Vendor profile and catalog',
    paths: ['/vendors/:supplier', '/vendors/:supplier/catalog', '/vendors/:supplier/reviews', '/supplier/:supplier'],
  },
  {
    family: 'evidence',
    access: 'public',
    label: 'COAs and batch verification',
    paths: ['/coas', '/verify', '/submit-coa', '/coa/submit-coa'],
  },
  {
    family: 'commerce',
    access: 'public',
    label: 'Cart and checkout',
    paths: ['/cart'],
  },
  {
    family: 'orders',
    access: 'link',
    label: 'Order and customer action flows',
    paths: [
      '/order-status',
      '/order/status',
      '/order/status/:uuid',
      '/order/escrow-check-in',
      '/order/escrow-check-in/success',
      '/confirm-delivery',
      '/confirm-delivery/success',
      '/order/tracking/send/:uuid',
      '/refund/:token',
      '/review/:uuid',
      '/trustpilot-reward/:uuid',
      '/review-boost/claim/:uuid',
      '/review-boost/revoke/:token',
      '/campaign/:campaignId/:orderUuid',
      '/research/:token',
      '/dispute/:slug',
      '/p/:id',
      '/supplier/order-review',
    ],
  },
  {
    family: 'content',
    access: 'public',
    label: 'Company and support pages',
    paths: [
      '/about',
      '/contact',
      '/faq',
      '/shipping',
      '/privacy',
      '/privacy-policy',
      '/terms',
      '/disclaimers',
    ],
  },
  {
    family: 'library',
    access: 'public',
    label: 'Articles and research library',
    paths: ['/articles', '/articles/:slug', '/khavinson'],
  },
  {
    family: 'auth',
    access: 'public',
    label: 'Authentication',
    paths: ['/login', '/login/check-email', '/auth/reset-password', '/auth/update-password'],
  },
  { family: 'seller', access: 'seller', label: 'Seller portal', paths: ['/seller'] },
  {
    family: 'admin',
    access: 'admin',
    label: 'Admin console',
    paths: [
      '/admin',
      '/panel',
      '/local/admin',
      '/local/admin/affiliates',
      '/local/admin/batch-numbers',
      '/local/admin/beta-invites',
      '/local/admin/customer-explorer',
      '/local/admin/data-analysis',
      '/local/admin/disputes',
      '/local/admin/disputes/:slug',
      '/local/admin/escrow',
      '/local/admin/impersonate',
      '/local/admin/onboard',
      '/local/admin/order-lookup',
      '/local/admin/payment-router',
      '/local/admin/peerpay-lookup',
      '/local/admin/research-campaign',
      '/local/admin/shopify-codes',
      '/local/admin/sla-violations',
      '/local/admin/stats',
      '/local/admin/status-updates',
      '/local/admin/store-credits',
      '/local/admin/supplier-health',
      '/local/admin/suppliers/:name/escrow',
      '/local/admin/trustpilot-claims',
      '/local/admin/vendor-control',
      '/local/admin/vendor-integrity-survey',
      '/local/admin/weekly-limits',
    ],
  },
  {
    family: 'admin',
    access: 'admin',
    label: 'Admin pricing',
    paths: ['/admin/pricing'],
  },
  {
    family: 'staff',
    access: 'staff',
    label: 'Staff workspace',
    paths: [
      '/staff',
      '/staff/batch-numbers',
      '/staff/disputes',
      '/staff/disputes/:slug',
      '/staff/order-lookup',
      '/staff/supplier-health',
      '/staff/suppliers',
      '/staff/trustpilot-claims',
    ],
  },
  {
    family: 'affiliate',
    access: 'seller',
    label: 'Affiliate workspace',
    paths: ['/affiliate', '/local/affiliates'],
  },
  { family: 'api', access: 'public', label: 'Public API docs', paths: ['/docs/api'] },
  {
    family: 'content',
    access: 'public',
    label: 'Localized storefront',
    paths: ['/:locale/*'],
  },
]

export const coveredRoutes = routeManifest.flatMap((entry) => entry.paths)

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const patternToRegex = (pattern: string) => {
  if (pattern === '/') return /^\/$/
  const segments = pattern.split('/').filter(Boolean)
  const source = segments
    .map((segment) => {
      if (segment === '*') return '.*'
      if (segment.startsWith(':')) return '[^/]+'
      return escapeRegex(segment)
    })
    .join('/')
  return new RegExp(`^/${source}/?$`)
}

const sortedRouteEntries = routeManifest
  .flatMap((definition) => definition.paths.map((path) => ({ definition, path })))
  .sort((a, b) => {
    const aDynamic = (a.path.match(/[:*]/g) ?? []).length
    const bDynamic = (b.path.match(/[:*]/g) ?? []).length
    if (aDynamic !== bDynamic) return aDynamic - bDynamic
    return b.path.length - a.path.length
  })

export function resolveRoute(pathname: string): RouteDefinition {
  const normalized = pathname !== '/' ? pathname.replace(/\/+$/, '') : '/'
  return (
    sortedRouteEntries.find(({ path }) => patternToRegex(path).test(normalized))?.definition ?? {
      family: 'content',
      access: 'public',
      label: 'Not found',
      paths: [normalized],
    }
  )
}

export const previewRoutes = [
  '/',
  '/products',
  '/catalog/BPC-157',
  '/vendors',
  '/vendors/sample-vendor-zero',
  '/coas',
  '/verify',
  '/coa/submit-coa',
  '/cart',
  '/order/status/preview',
  '/articles',
  '/about',
  '/login',
  '/seller',
  '/admin',
  '/admin/pricing',
  '/staff',
] as const
