# PeptShop2 — Comprehensive Codebase Analysis

**Repository:** `C:/Users/jmroc/peptshop2`
**Date:** August 5, 2026
**Branch:** `dev` (active), `main` (production)

---

## 1. Architecture Overview

| Aspect | Detail |
|--------|--------|
| **Framework** | React 19.2.3 + TypeScript 5.8.3 |
| **Build Tool** | Vite 8.1.5 (`@vitejs/plugin-react` 6.0.3) |
| **Styling** | Hand-written CSS + Tailwind CSS 3.4.19 (utilities only, preflight disabled) |
| **Icons** | `lucide-react` 0.511.0 |
| **Routing** | Custom hash-free client-side router (no react-router) |
| **State** | React `useState`/`useMemo` + `localStorage` (cart persistence) |
| **Package Type** | ES module (`"type": "module"`) |
| **Deployment** | Vite build → static site (SPA with `public/_redirects` for client-side routing) |

### Key Architectural Principle: Public/Private Boundary

The repo is **presentation-only**. It contains zero backend code — no Supabase client, no `fetch()` calls, no environment variable reads, no database queries. A build-time script (`scripts/check-boundary.mjs`) enforces this by scanning all source files for banned patterns:

- `@supabase/`, `.from(`, `fetch(`, `axios`, `next/`, `@/` imports
- `process.env` / `import.meta.env`
- Secret markers (`SUPABASE_DB_PASSWORD`, `SERVICE_ROLE_KEY`, etc.)

The backend is controlled by a partner ("the backend owner") on a separate Next.js server. The frontend communicates with it through **callback props** (`PeptShopActions`) and **view model props** (`PeptShopViewModels`) — a clean adapter pattern defined in `INTEGRATION_CONTRACT.md`.

### Entry Points

1. **`index.html`** — Standalone Vite dev/preview entry. Loads `/src/main.tsx`.
2. **`src/main.tsx`** — Renders `<App />` (which is `<PeptShopFrontend />`) into `#root`. Imports `frontend.css` (design system) and `preview.css` (preview-only styles).
3. **`src/index.ts`** — Library entry point. Exports all components, types, and view models for consumption by the private Next.js application. The private app imports `PeptShopFrontend`, `ProductMarketplaceView`, `AdminPricingSurface`, `SellerWorkspaceFrame`, `SellerEscrowGate`, etc. directly.

### Dual Usage

The same codebase serves two purposes:
- **Standalone preview** (`npm run dev`): Uses mock data, `browser` navigation mode, full route access.
- **Embedded in Next.js** (production): The private app renders components with real data via props, using `memory` navigation mode and `allowedRouteFamilies` restrictions.

---

## 2. Directory Structure

```
peptshop2/
├── index.html                      # Vite SPA entry (meta tags, CSP, JSON-LD)
├── package.json                    # @peptshop/frontend — deps + scripts
├── tsconfig.json                   # Strict TS, ES2022, Bundler resolution
├── vite.config.ts                  # Minimal — just React plugin + allowedHosts
├── tailwind.config.js              # Tailwind scoped to #ps-storefront, preflight off
├── postcss.config.js               # Tailwind + autoprefixer
├── AGENTS.md                       # Agent instructions (architecture, CSS, git, payment)
├── INTEGRATION_CONTRACT.md         # Public/private boundary contract
├── README.md                       # Developer guide + QA lane instructions
├── ROUTE_COVERAGE.md               # Route documentation
├── PUBLISHING.md                   # Publishing guidelines
├── DESIGN.md / style.md            # Design system docs
├── DEVLOG.md / HANDOFF.md          # Development log / handoff notes
├── scripts/
│   └── check-boundary.mjs          # Build-time boundary enforcement (banned patterns)
├── public/
│   ├── peptshop-logo.svg           # Logo (dark variant: -white.svg)
│   ├── og-image.png                # OpenGraph image
│   ├── favicon.ico + sized PNGs    # Browser identity
│   ├── site.webmanifest            # PWA manifest
│   ├── robots.txt + sitemap.xml    # SEO
│   ├── llms.txt + llms-full.txt    # LLM-readable context
│   ├── _redirects                  # SPA fallback: /* → /index.html 200
│   ├── vial.svg / vial.png         # Vial imagery
│   └── images/products/*.png       # ~80 compound vial images
├── webhooks/
│   └── peerpay-server/
│       ├── peerpay-server.js        # Express webhook receiver (port 8787)
│       ├── package.json             # Zero dependencies (raw http module)
│       └── events/                  # Stored webhook events (JSON files)
└── src/
    ├── main.tsx                    # Vite entry — renders <App/>
    ├── App.tsx                     # PeptShopFrontend — root component + router
    ├── index.ts                    # Library exports for Next.js consumer
    ├── contracts.ts                # Type definitions (view models + actions)
    ├── mock-data.ts                # 82 products, 4 vendors, 15 COAs, 6 orders, research studies
    ├── preview-fixtures.ts         # Synthetic admin pricing + escrow gate fixtures
    ├── navigation.tsx              # FrontendLink component + routeIsActive helper
    ├── route-manifest.ts           # All route definitions + resolver
    ├── shell.tsx                   # StorefrontShell (customer) + PortalShell (seller/admin)
    ├── frontend.css                # @imports all CSS layers (tokens, shell, storefront, portal, responsive)
    ├── preview.css                 # Preview-only styles (page explorer, toast)
    ├── email-theme.ts              # Color tokens for private email renderer
    ├── react-custom-attributes.d.ts # Type declarations for custom HTML attributes
    ├── admin-pricing.tsx           # AdminPricingSurface component (vendor pricing management)
    ├── admin-pricing.module.css    # Scoped admin pricing styles
    ├── seller-escrow-gate.tsx      # SellerEscrowGate component (escrow tier selection)
    ├── product-page.tsx            # Low-level product page frame components
    ├── product-page.module.css     # Scoped product page styles
    ├── product-marketplace-view.tsx # ProductMarketplaceView (shared product page structure)
    ├── order-status.module.css     # Order status/timeline styles
    ├── styles/
    │   ├── tokens.css              # CSS variables (light/dark themes), resets, base components
    │   ├── shell.css               # Header, footer, navigation styles
    │   ├── storefront.css          # ~7000 lines — homepage, catalog, product, vendor, COA, cart styles
    │   ├── portal.css              # Seller/admin/staff portal styles
    │   ├── responsive.css          # ~1000 lines — media queries for all breakpoints
    │   └── purged-css.ts           # CSS injected at runtime to bypass Tailwind purge
    └── pages/
        ├── home-page.tsx           # Homepage (hero, ticker, popular products, evidence, vendors)
        ├── market-pages.tsx        # Catalog, ProductPage (legacy), VendorsPage, VendorPage
        ├── product-marketplace-page.tsx # ProductMarketplacePage (newer product page adapter)
        ├── commerce-pages.tsx      # Cart/checkout + order flow pages
        ├── evidence-pages.tsx      # COA library + batch verification
        ├── content-pages.tsx       # About, FAQ, contact, shipping, privacy, terms, articles, API docs
        └── portal-pages.tsx        # Auth, Seller, Admin, Staff, Affiliate pages
```

---

## 3. Routing System

### Custom Router (No react-router)

The routing system is entirely custom, built in `src/route-manifest.ts` and `src/App.tsx`.

**How it works:**
1. `routeManifest` is an array of `RouteDefinition` objects, each with a `family`, `access` level, `label`, and `paths` array.
2. `resolveRoute(pathname)` converts path patterns (with `:param` and `*` wildcards) to regexes, sorts by specificity (static routes first, dynamic last), and returns the matching `RouteDefinition`.
3. `App.tsx` calls `resolveRoute(pathname)` on every navigation, gets a `family`, and `renderPage()` switches on the family to render the appropriate page component.
4. Navigation uses `window.history.pushState()` + `setLocation()` (no page reload). `popstate` events are listened to for back/forward.

**Navigation modes:**
- `browser` — Uses `window.location` + `pushState`. For standalone preview.
- `memory` — Keeps path in React state only. For embedded Next.js usage.

### All Route Families

| Family | Access | Paths | Component |
|--------|--------|-------|-----------|
| `home` | public | `/` | `HomePage` |
| `catalog` | public | `/products`, `/peptides` | `CatalogPage` |
| `product` | public | `/catalog/:name`, `/products/:slug`, `/product/:id`, `/peptides/:slug` | `ProductMarketplacePage` |
| `vendors` | public | `/vendors` | `VendorsPage` |
| `vendor` | public | `/vendors/:supplier`, `/vendors/:supplier/catalog`, `/vendors/:supplier/reviews`, `/supplier/:supplier` | `VendorPage` |
| `evidence` | public | `/coas`, `/verify`, `/submit-coa`, `/coa/submit-coa` | `EvidencePage` |
| `commerce` | public | `/cart` | `CommercePage` (CartPage) |
| `orders` | link | `/order-status`, `/order/status`, `/order/status/:uuid`, `/order/escrow-check-in`, `/confirm-delivery`, `/refund/:token`, `/review/:uuid`, `/dispute/:slug`, `/research/:token`, `/p/:id`, + 10 more | `OrderFlowPage` |
| `content` | public | `/about`, `/contact`, `/faq`, `/shipping`, `/privacy`, `/terms`, `/disclaimers`, `/:locale/*` | `ContentPage` |
| `library` | public | `/articles`, `/articles/:slug`, `/khavinson` | `LibraryPage` |
| `auth` | public | `/login`, `/login/check-email`, `/auth/reset-password`, `/auth/update-password` | `AuthPage` |
| `seller` | seller | `/seller`, `/seller/escrow-gate` | `SellerPage` |
| `admin` | admin | `/admin`, `/panel`, `/local/admin`, `/local/admin/*` (20+ sub-routes), `/admin/pricing` | `AdminPage` |
| `staff` | staff | `/staff`, `/staff/*` (7 sub-routes) | `StaffPage` |
| `affiliate` | seller | `/affiliate`, `/local/affiliates` | `AffiliatePage` |
| `api` | public | `/docs/api` | `ApiDocsPage` |

**Excluded routes** (enforced by boundary check): `/group-testing`, `/rfq`, `/pools` — these are explicitly out of scope.

### Shell Selection

The `App.tsx` `renderPage` function determines whether to wrap the page in `StorefrontShell` (customer-facing pages with header/footer) or render bare (portal pages use `PortalShell` internally):

```tsx
const isPortal = ['seller', 'admin', 'staff', 'affiliate'].includes(route.family)
// Portal/api pages: bare div with data-theme
// Customer pages: wrapped in StorefrontShell
```

---

## 4. Component Hierarchy

### Root: `PeptShopFrontend` (App.tsx)

```
PeptShopFrontend
├── StorefrontShell (customer pages)
│   ├── Header (logo, search, nav, cart drawer, mobile menu)
│   ├── <main> — page content
│   └── Footer (only on home page, 3-column links)
│
├── PortalShell (seller/admin/staff/affiliate pages)
│   ├── Sidebar (brand, role label, nav items, status)
│   └── PortalMain (content area)
│       └── PortalTopbar + page content
│
├── PreviewTools (optional — page explorer for dev)
└── Toast (feedback messages)
```

### Page Components

**HomePage** (`home-page.tsx`):
- Dark hero section (logo, search, featured product card with vial image)
- Ticker bar (stats: compounds, vendors, payment methods, no-signup)
- Popular products grid (6 hand-picked: PT-141, NAD+, Tesamorelin, GHK-Cu, Retatrutide, Semaglutide)
- Evidence band (COA showcase)
- How it works (3-step process)
- Featured vendors (top 3 from models.vendors)

**CatalogPage** (`market-pages.tsx`):
- Search input, region dropdown (US/EU/CN), filter button, stock toggle
- Sort options (popular, A-Z, price low-high, price high-low)
- Infinite scroll via `IntersectionObserver` (24 items at a time)
- CatalogCard (text-only, no images — per AGENTS.md rule)
- Back-to-top button

**ProductMarketplacePage** (`product-marketplace-page.tsx`):
- Parses product name from URL (`/products/:slug`, `/catalog/:name`, `/peptides/:slug`)
- Builds `ProductMarketplaceModel` from mock data + vendor data
- Renders `ProductMarketplaceView` (shared component)
- Modal: compound waitlist (email signup for unavailable products)
- Modal: vendor reviews (tabs: reviews + COAs, metric cards, review distribution, paginated reviews)

**ProductMarketplaceView** (`product-marketplace-view.tsx`):
- `ProductPageFrame` → `ProductPageHero` (name, CAS, formula, MW, overview, dosage selector)
- `ProductOffersSection` → vendor offer cards (price, pack size, purity, batch, dispatch, COA link)
- Order summary sidebar (product, unit price, quantity, total, escrow/batch badges, add-to-cart)
- Research library section (PubMed studies per compound)

**VendorPage** (`market-pages.tsx`):
- Three modes: overview, catalog, reviews
- Overview: vendor story, facts (orders, on-time %, dispatch, COAs), fulfillment notes, review preview
- Catalog: compact product list
- Reviews: paginated 10/page, rating distribution, verified buyer reviews

**CartPage** (`commerce-pages.tsx`):
- Cart items grouped by vendor with free-shipping progress bars ($400 threshold)
- Contact form (email, phone)
- Delivery form (name, country, address, city, state, postal)
- Payment method selection (NOWPayments vs PeerPay with 9% fee)
- Order summary sidebar (line items, subtotal, per-vendor shipping, total)
- Terms checkboxes (research-use, 21+ age)
- Place Order button (form-validity gated)

**OrderFlowPage** (`commerce-pages.tsx`):
- Order lookup page (order number + email)
- Order status detail (timeline with 5 steps, order info card)
- Customer action pages (review, refund, delivery confirmation, dispute, research survey)

**EvidencePage** (`evidence-pages.tsx`):
- COA library: searchable table (compound, vendor, lab, batch, tested date, purity result)
- Filterable by `?vendor=X&product=Y` query params
- Sorted latest-first
- Verify page: batch number input → simulated match result

**SellerPage** (`portal-pages.tsx`):
- Hash-based section navigation: `#dashboard`, `#orders`, `#catalog`, `#batches`, `#shipping`, `#inbox`, `#availability`
- Dashboard: metrics grid, orders table, capacity gauge, catalog health, fulfillment signals
- Escrow gate route (`/seller/escrow-gate`): 3-tier selection (EXEMPT 0%, STANDARD 15%, EXTENDED 50%)

**AdminPage** (`portal-pages.tsx`):
- Overview: metrics, operations queue, system watchlist, vendor control, add-vendor modal
- Pricing sub-route (`/admin/pricing`): `AdminPricingSurface` with vendor selector, pricing tiers, availability toggle

---

## 5. Data Flow

### Mock Data Only (Dev Branch)

All data on the `dev` branch comes from `src/mock-data.ts` — a single `mockModels` object conforming to `PeptShopViewModels`:

| Data | Source | Count |
|------|--------|-------|
| Products | `mockModels.products` | 82 compounds (22 available, 60 watchlist) |
| Vendors | `mockModels.vendors` | 4 (Northstar Research, Retalux, Axiom Peptides, Sample Vendor Zero) |
| COAs | `mockModels.coas` | 15 records (all Janoshik Analytical lab) |
| Orders | `mockModels.orders` | 6 synthetic orders |
| Seller Metrics | `mockModels.sellerMetrics` | 4 metrics |
| Research Studies | `researchStudies` | 10+ studies per compound (real PubMed links for top compounds, `#` placeholder URLs for others) |

### Product Details

`productDetails` in `market-pages.tsx` is a hardcoded record mapping product names to:
- CAS number, molecular formula, molecular weight (MW)
- Scientific description
- For blends: CAS/MW = "N/A", components in Formula field

### Pricing Math

Prices are **deterministic presentation math**, not real marketplace data:
```
lookupVendorPrice(dose, vendorId) = basePrice × (dose/baseDose) × priceMultiplier[vendorId]
```
Where `priceMultiplier` varies by vendor: Northstar=1.0, Retalux=1.08, Axiom=0.94, SampleZero=0.85.

Per-mg price = `startingPrice / (firstFormat × 10)` — displayed on catalog cards and homepage.

### Production Data Flow (Main Branch)

On `main`, the private Next.js app supplies real data through `PeptShopViewModels` props:
- Products from Supabase queries
- Vendors from vendor directory
- COAs from batch evidence records
- Cart from server-side cart state
- Orders from order management system

The frontend **never** makes API calls — it receives everything through props.

---

## 6. State Management

### No External State Library

State is managed entirely through React hooks. There is no Redux, Zustand, Jotai, or Context provider.

### Cart State (in App.tsx)

```tsx
const [cartLines, setCartLines] = useState<CartLine[]>(() => {
  // Load from localStorage on mount
  const saved = localStorage.getItem('peptshop-cart')
  if (saved) return JSON.parse(saved)
  return models.cart ?? []
})

// Persist to localStorage on every change
useEffect(() => {
  localStorage.setItem('peptshop-cart', JSON.stringify(cartLines))
}, [cartLines])
```

Cart operations are defined in the `actions` memo:
- `addToCart(productId, vendorId, vendorName, unitPrice, format, shippingCost)` — deduplicates by `${productId}-${vendorId}`, increments quantity if exists
- `updateCartQuantity(lineId, quantity)` — removes if ≤0
- `removeCartLine(lineId)`
- `clearCart()`
- `beginCheckout()` → navigates to `/cart`
- `submitCheckout(form)` → calculates total, clears cart, navigates to order status

### Theme State

```tsx
const [theme, setTheme] = useState<FrontendTheme>(providedTheme ?? 'light')
```

Theme is applied via `data-theme` attribute on `#ps-storefront` div. Dark theme activates via `[data-theme="dark"]` CSS selector.

### Navigation State

```tsx
const [{ pathname, query }, setLocation] = useState(readLocation(navigationMode))
```

Updated by `navigate()` which calls `pushState` + `setLocation` + scrolls to top.

### Seller Page Hash Navigation

The seller page uses `window.location.hash` for section switching:
```tsx
const [hash, setHash] = useState(() => window.location.hash || '#dashboard')
// Listens to hashchange + popstate events
```

### Portal Shell Active State

`PortalShell` tracks `activeSellerHref` for sidebar nav highlighting, syncing with hash changes.

---

## 7. Styling System

### CSS Architecture

The CSS is organized in layers, imported via `src/frontend.css`:

```css
@import './styles/tokens.css';       /* Variables, resets, base components */
@import './styles/shell.css';        /* Header, footer, navigation */
@import './styles/storefront.css';   /* ~7000 lines — all customer page styles */
@import './styles/portal.css';       /* Seller/admin/staff portal styles */
@import './styles/responsive.css';   /* ~1000 lines — media queries */
```

### CSS Isolation

**All CSS is scoped to `#ps-storefront`**. The boundary check script (`check-boundary.mjs`) enforces that every CSS rule in `src/styles/*.css` starts with `#ps-storefront`. This prevents styles from leaking into or out of the host Next.js application.

### CSS Variables (Design Tokens)

Defined in `tokens.css`:

**Light theme (default):**
| Token | Value | Usage |
|-------|-------|-------|
| `--ps-accent` | `#ffa300` | Orange brand color (buttons, links, highlights) |
| `--ps-accent-hover` | `#eb9600` | Hover state |
| `--ps-canvas` | `#f4f5f7` | Page background |
| `--ps-paper` | `#ffffff` | Card/panel background |
| `--ps-surface` | `#eef1f4` | Secondary surface |
| `--ps-ink` | `#12161d` | Primary text |
| `--ps-muted` | `#5d6673` | Secondary text |
| `--ps-line` | `#dfe3e8` | Borders |
| `--ps-success` | `#167a53` | Success states |
| `--ps-danger` | `#a43737` | Error states |
| `--ps-deep` | `#111419` | Dark sections (footer) |

**Dark theme** (`[data-theme="dark"]`):
| Token | Value |
|-------|-------|
| `--ps-accent` | `#ffad24` |
| `--ps-canvas` | `#14171b` |
| `--ps-paper` | `#1b1f24` |
| `--ps-ink` | `#f4f6f8` |
| `--ps-muted` | `#b0bac5` |
| `--ps-line` | `#30373f` |

### Theme Rules (from AGENTS.md)

- **Dark theme** on customer pages (homepage hero is always dark)
- **Light theme** on admin/seller pages
- Seller pages scoped with `:has(.seller-page)` — dark only on customer pages
- Logo color: `#FFA300`
- Homepage buttons: all orange

### CSS Modules

Three files use CSS Modules for component-scoped styles:
- `product-page.module.css` — Product page frame components
- `admin-pricing.module.css` — Admin pricing surface
- `order-status.module.css` — Order status timeline

### Tailwind CSS

Tailwind is configured but **preflight is disabled** (to avoid clashing with the `ps-` CSS reset). Only utility classes are used. Tailwind is scoped to `#ps-storefront` via `important: '#ps-storefront'`.

### Runtime CSS Injection (Purged CSS)

A notable workaround: `src/styles/purged-css.ts` contains CSS rules that the backend owner's build pipeline purges from `storefront.css` (because Tailwind's content scanner doesn't detect dynamically-created class names). These rules are injected at runtime via a `<style>` tag:

```tsx
useEffect(() => {
  const style = document.createElement('style')
  style.id = 'ps-runtime-purged-styles'
  style.textContent = PURGED_CSS
  document.head.appendChild(style)
}, [])
```

This covers COA table, escrow modal, and dark-theme private surface styles.

### Responsive Approach

`responsive.css` contains ~1000 lines of media queries at breakpoints:
- `max-width: 1100px` — Tablet adjustments (grid columns, hidden columns)
- `max-width: 768px` — Mobile (stacked layouts, hidden elements)
- `max-width: 640px` — Small mobile (hero adjustments)
- `max-width: 480px` — Very small screens

Uses `clamp()` extensively for fluid typography and spacing:
```css
font-size: clamp(2.4rem, 5.5vw, 4.8rem);
padding-inline: clamp(1rem, 3vw, 2.5rem);
```

---

## 8. Key Features

### Catalog
- 82 compounds across 12+ categories (Metabolic, Tissue Repair, Endocrine, Nootropic, etc.)
- Text-only product cards (no images on catalog — per design rule)
- Search, region filter (US/EU/CN), stock-only filter, 4 sort options
- Infinite scroll (24 per page, IntersectionObserver)
- Per-mg pricing displayed alongside pack price
- COA count badge on each card

### Product Detail Page
- Two implementations exist:
  1. **Legacy** `ProductPage` in `market-pages.tsx` — directly renders vendor offers
  2. **Current** `ProductMarketplacePage` → `ProductMarketplaceView` — shared component used by both Vite and production
- Both use the same frame components from `product-page.tsx`
- Dosage selector (e.g., 2mg, 5mg, 10mg)
- Vendor offer cards with: vendor name, verified badge, rating, location, fulfillment, purity %, batch number, dispatch time, COA link
- Pack size options (10 vials, 20 vials with 1.9× price multiplier)
- Quantity selector + add-to-cart with dynamic price
- Order summary sidebar with escrow/batch badges
- Research library section (PubMed study links, expandable)
- Compound waitlist modal for unavailable products

### Vendor System
- 4 vendors: Northstar Research (US, 4.9★), Retalux (US, 4.8★), Axiom Peptides (EU, 4.7★), Sample Vendor Zero (US, 4.5★)
- Vendor directory page with search, summary stats
- Vendor profile pages: overview, catalog, reviews (paginated 10/page)
- Verified badge system (admin-verified vendors get orange shield)
- Review modal with tabs (Customer Reviews + COAs), rating distribution, metric cards

### Cart & Checkout
- Cart persisted in `localStorage` (`peptshop-cart` key)
- Cart grouped by vendor with free-shipping progress bars ($400 threshold per vendor)
- Cart preview drawer on hover (header cart icon)
- Shipping: $50/vendor flat rate, free at $400+ per vendor
- Checkout form: contact, delivery, payment selection, terms
- Form validity gates the Place Order button

### COAs (Certificates of Analysis)
- COA library at `/coas` — searchable, filterable by vendor/product
- Sorted latest-first
- 15 mock COA records (all from Janoshik Analytical)
- Batch verification at `/verify` — simulated match result
- COA buttons route to `/coas?vendor=X&product=Y` (removed from product pages per AGENTS.md)

### Reviews
- Popup modal with tabs (Reviews + COAs)
- Metric cards (average rating, recommendation rate)
- Rating distribution bar chart (78% 5-star, 14% 4-star, etc.)
- Paginated 10/page at `/vendors/:slug/reviews`
- Reviews generated from 20 templates, cycled and time-stamped

### Seller Dashboard
- Hash-based navigation: dashboard, orders, catalog, COAs, shipping, messages, settings
- Metrics grid (ready to fulfill, 7-day sales, on-time shipping, escrow balance)
- Orders table with expandable detail view
- Catalog management (product list + add product form)
- COA batch uploads table
- Shipping tier configuration ($50 flat, free at $400+)
- Settings (vendor name, email, wallet address)
- Escrow gate: 3-tier selection (0%, 15%, 50%) with confirmation flow

### Admin Console
- Metrics overview (gross order value, orders in review, active vendors, held orders)
- Operations queue with order table
- System watchlist (high/medium/low severity items)
- Vendor control panel with add-vendor modal
- Admin pricing page: vendor selector, pricing tier editor, availability toggle, search

### Staff & Affiliate Workspaces
- Staff: ticket metrics, assigned work queue
- Affiliate: sales metrics, active links table

### Content Pages
- About, Shipping (with country selector), Privacy, Terms, Disclaimers (comprehensive)
- FAQ (9 items, searchable, FAQPage JSON-LD schema injected)
- Contact (4-statement gate before revealing form)
- Articles library + article detail pages
- API documentation page

### Research Library
- PubMed study links per compound
- Real PubMed URLs for top compounds (BPC-157, NAD+, GHK-Cu, Semaglutide, PT-141)
- Placeholder `#` URLs for many compounds (templated studies)
- Expandable "Show more studies" (5 visible by default)

---

## 9. Payment System

### NOWPayments (Crypto)

- Primary payment method (default selected)
- Supports BTC, ETH, USDT, USDC, XMR, 100+ coins
- Displayed in checkout with `WalletCards` icon
- No integration code in this repo — payment logic is in the private backend

### PeerPay (P2P Payment)

- Secondary payment method (radio button)
- Supports Venmo, Zelle, Cash App, Revolut, Wise, Monzo, N26
- **9% provider fee** baked into total:
  ```tsx
  const peerPayFee = paymentMethod === 'peerpay' ? subtotal * 0.09 : 0
  const total = subtotal + totalShipping + peerPayFee
  ```
- Displayed in order summary with "includes 9% PeerPay fee" note
- Visual badges for each payment method

### Escrow

- **Crypto escrow**: Payment held until buyer confirms delivery and COA match
- **Seller escrow gate**: 3 tiers (EXEMPT 0%, STANDARD 15%, EXTENDED 50%)
  - STANDARD: portion held temporarily, weekly volume cap applies
  - EXTENDED: half held, no weekly cap, requires confirmation (treated as permanent)
- Escrow balance shown in seller dashboard metrics
- "Escrow protected" badge on product order summary

### Webhook Server

`webhooks/peerpay-server/peerpay-server.js` is a lightweight Express-like server (using Node's raw `http` module, zero dependencies):

- **Port**: 8787 (or `PORT` env var)
- **URL**: `http://the build server:8787/webhooks/peerpay`
- **Endpoints**:
  - `GET /` or `/health` — Health check
  - `GET /events` — List stored webhook events
  - `GET /events/:id` — View single event
  - `POST /webhooks/peerpay` — Webhook receiver
- **Event types handled**: `ORDER_CREATED`, `ORDER_FULFILLED`, `ORDER_CANCELLED`, `PAYMENT_SETTLED`, `ORDER_RESIZED`, `PAYMENT_FAILED`, `PAYMENT_EXPIRED`, `PAYMENT_CANCELLED`
- **Storage**: Events saved as JSON files in `events/` directory
- **Forwarding**: Optionally forwards to the backend owner's backend via `BACKEND_WEBHOOK_URL` env var
- Reads `x-peerpay-signature` header (stored but not verified in this code)

---

## 10. Build & Deploy

### Build Process

```json
"scripts": {
  "dev": "vite --host 127.0.0.1",
  "check": "node scripts/check-boundary.mjs",
  "build": "npm run check && tsc --noEmit && vite build",
  "preview": "vite preview --host 127.0.0.1"
}
```

1. **`npm run check`** — Boundary check: scans all `.ts/.tsx/.css` files for banned patterns (Supabase, fetch, env vars, Next.js imports, excluded route links). Also verifies homepage markers are preserved and all CSS is scoped to `#ps-storefront`.
2. **`tsc --noEmit`** — TypeScript type check (strict mode)
3. **`vite build`** — Production bundle

### Vite Config

Minimal configuration:
```ts
export default defineConfig({
  plugins: [react()],
  server: { allowedHosts: true },
})
```

### Git Workflow

- **`dev` branch** (active): Mock data, frontend development. Deploys to dev environment.
- **`main` branch**: Production. Real data via the backend owner's backend. The private app synchronizes the reviewed frontend revision.
- **Policy**: Only push to `dev`. Never push to `main` unless explicitly told. No deploy rollbacks.

### SPA Deployment

`public/_redirects` contains: `/* /index.html 200` — standard SPA fallback for Netlify-style hosting.

### Package Exports

The package is also a library:
```json
"exports": {
  ".": "./src/index.ts",
  "./styles.css": "./src/frontend.css",
  "./product-page": "./src/product-page.tsx"
}
```

This allows the Next.js backend to import components directly.

### Content Security Policy

`index.html` includes a strict CSP:
```
default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; 
font-src 'self' https://fonts.gstatic.com; script-src 'self' 'unsafe-inline'; 
connect-src 'self'; base-uri 'self'; form-action 'self'
```

---

## 11. Notable Patterns & Conventions

### Adapter Pattern (INTEGRATION_CONTRACT.md)

The frontend/private-app boundary is formally documented:
- **Frontend owns**: Layout, styles, responsive behavior, visible states, presentational interaction
- **Private app owns**: Data, auth, business rules, side effects, payment routing, escrow, refunds
- **Interface**: `PeptShopViewModels` (sanitized display objects) + `PeptShopActions` (callbacks)

### FrontendLink Component

All internal links use `FrontendLink` (`navigation.tsx`), which intercepts clicks, prevents default, and calls `navigate()`. This enables SPA navigation without react-router. It respects modifier keys (cmd+click, ctrl+click) for native tab opening.

### Preview Tools

When `showPreviewTools` is true (standalone dev mode), a "Page explorer" panel appears in the bottom-right corner. It allows:
- Viewing current route
- Copying route path
- Switching light/dark theme
- Navigating to preview routes

### `noopActions` 

A no-op implementation of `PeptShopActions` is exported from `contracts.ts` for use in isolated component testing.

### Custom HTML Attributes

`react-custom-attributes.d.ts` extends React's type declarations to support custom attributes like `toolname`, `tooldescription`, `toolparamdescription` on form elements — likely for AI agent tool-use integration.

### Email Theme

`email-theme.ts` exports a `peptShopEmailTheme` object with the same color tokens as the CSS variables, used by the private email renderer for transactional emails.

### SEO

- `robots.txt`, `sitemap.xml` in `public/`
- `llms.txt` + `llms-full.txt` for LLM-readable site context
- OpenGraph + Twitter card meta tags in `index.html`
- JSON-LD structured data (`OnlineStore` schema in `index.html`, `FAQPage` schema injected dynamically)
- All product images have descriptive alt text

---

## 12. Issues, Dead Code & TODOs

### Dead Code / Duplication

1. **Duplicate ProductPage implementations**: `ProductPage` in `market-pages.tsx` (lines 377-671) and `ProductMarketplacePage` in `product-marketplace-page.tsx` both render product detail pages. The route manifest maps the `product` family to `ProductMarketplacePage`, so the legacy `ProductPage` in `market-pages.tsx` appears to be dead code (though it's still exported and used for `CatalogPage`'s `productDetails` and `generateReviews`).

2. **Duplicate footer**: `shell.tsx` has identical footer markup for both `isHome` and non-home paths (lines 231-345). The ternary `isHome ? (...) : (...)` renders the same footer either way.

3. **`CommercePage` always renders `CartPage`**: 
   ```tsx
   export function CommercePage(props: PageComponentProps) {
     if (props.pathname === '/cart') return <CartPage {...props} />
     return <CartPage {...props} />
   }
   ```
   The conditional is meaningless — both branches return the same thing.

4. **`previewVendorOffers_REMOVED`**: A constant `const previewVendorOffers_REMOVED = true` in `market-pages.tsx` (line 305) is a leftover marker indicating removed code.

5. **`as any` type casts**: Vendors are cast `as any` in mock-data (lines 1050, 1064, 1078, 1092), and `verified` property is accessed via `(vendor as any).verified` throughout — the `VendorSummary` type doesn't include `verified`, but the mock data doesn't set it either, so these checks always evaluate to falsy.

6. **Templated research studies**: Many compounds share identical study templates with only the compound name swapped (e.g., `mots-c`, `5-amino-1mq`, `aod-9604`, `cartalax`, `pancragen`, `vilon`, `kp1` all use the same 6 study templates). These are placeholder data, not real research.

7. **`cagrilintide` studies contain `cartalax` study IDs**: In `mock-data.ts` line 1480, the `cagrilintide` research array includes entries with `cartalax-study-5` and `cartalax-study-6` IDs — a copy-paste error.

### Missing `p23` Product

Products are numbered `p1` through `p82` but there is no `p23` — the sequence jumps from `p22` (Sermorelin) to `p24` (BAC Water). This is likely intentional (removed product) but could confuse.

### Potential Issues

1. **`addToCart` price calculation**: When adding to cart from the product page, the `unitPrice` passed is `selection.option.price * selection.quantity` (total, not per-unit). This means cart line `unitPrice` actually represents a pack-level total, and the cart display multiplies it again by quantity. This could lead to incorrect pricing if quantity is changed in the cart.

2. **Cart `shippingCost` fallback**: The cart preview drawer uses `lines[0]?.shippingCost ?? 50` as a fallback, while `addToCart` uses `models.vendors.find(...)?.shippingCost ?? 12`. The fallback values are inconsistent (50 vs 12).

3. **No error boundaries**: There are no React Error Boundaries. A rendering error in any page component will crash the entire app.

4. **No 404 route in manifest**: The `resolveRoute` function returns a fallback `{ family: 'content', label: 'Not found' }` for unmatched routes, which renders `ContentPage` → `NotFoundPage`. This works but the fallback definition is implicit.

5. **CSP allows `'unsafe-inline'` for scripts**: The Content Security Policy in `index.html` includes `script-src 'self' 'unsafe-inline'` — necessary for the JSON-LD structured data but reduces XSS protection.

6. **Webhook server has no signature verification**: The PeerPay webhook server reads the `x-peerpay-signature` header but never verifies it. Events are accepted and stored regardless of signature validity.

7. **Webhook server uses raw `http` module**: The `peerpay-server.js` uses Node's built-in `http` module with no framework. The `package.json` has zero dependencies. This is intentional (minimal footprint) but means no rate limiting, no request validation, and manual body parsing.

### Design Notes

1. **Homepage images only**: Per AGENTS.md, images appear ONLY on the hero section + popular products section (6 specific items). All other product pages are text-only. This is a deliberate design choice for a research compound marketplace.

2. **Vial color system**: AGENTS.md documents a detailed vial color system (GHK-Cu = blue+gold, NAD+ = amber+copper, etc.) but the actual vial images are pre-rendered PNGs in `public/images/products/`.

3. **Admin email hardcoded**: `<admin email>` is documented in AGENTS.md as the admin email. Supabase magic links are used for auth (no passwords).

---

## Summary

PeptShop2 is a well-architected presentation-only frontend for a research compound marketplace. Its key distinguishing feature is the **strict public/private boundary** — enforced at build time — that keeps all backend logic, data access, and business rules in a separate Next.js application controlled by a partner. The frontend communicates exclusively through typed view models and callback props.

The codebase is a Vite + React 19 + TypeScript SPA with a custom router (no react-router), hand-written CSS scoped to `#ps-storefront` with CSS variables for theming, and `localStorage` for cart persistence. It covers ~16 route families spanning customer storefront (catalog, products, vendors, COAs, cart, checkout, orders), content pages (policies, FAQ, articles), and portal workspaces (seller, admin, staff, affiliate).

The payment system supports NOWPayments (crypto) and PeerPay (P2P with 9% fee), with a lightweight webhook receiver server. Escrow protection is a core marketplace feature with a 3-tier seller escrow gate.

The main areas for improvement are: removing duplicate product page implementations, fixing the `addToCart` price/quantity calculation, adding error boundaries, and cleaning up the `as any` type casts on vendor objects.