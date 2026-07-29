# PeptShop Frontend — Handoff Document

## What PeptShop Is

PeptShop is a **B2B research compound marketplace** (like Alibaba/eBay but for peptides). Multiple vendors list the same compounds at different prices, purities, and shipping speeds. Buyers compare vendor offers side-by-side on a single product page, pick one, and check out with escrow-protected payments.

**Live site:** https://www.peptshop.io
**Dev server:** http://the build server:5174 (Vite dev, accessible via browser tools)
**Repo:** `<repo path>/` on branch `dev`

---

## Architecture

### Two-App Setup
- **Our code (Vite + React + TypeScript):** Pure frontend SPA. We own the customer-facing pages, the shared live `ProductMarketplaceView`, and the production `/seller` workspace frame: sidebar, top bar, canvas, spacing, and responsive behavior. All shared CSS is scoped below `#ps-storefront`.
- **Private application code (Next.js):** Imports reviewed source from this repository. It owns backend behavior, authentication, authorization, data loading, order processing, and the operational seller panels rendered inside `SellerWorkspaceFrame`.
- **Product ownership boundary:** Edit `src/product-marketplace-view.tsx`, `src/product-page.tsx`, and the product rules in `src/styles/storefront.css` to change both the standalone and production catalog product layout. The private application supplies customer-safe live offers and handles cart, waitlist, review, COA, and batch callbacks.
- **Seller ownership boundary:** Edit `SellerWorkspaceFrame`, `PortalShell`, and `src/styles/portal.css` to change the production `/seller` shell. The private application supplies the real supplier title, navigation callbacks, sign-out callback, and authenticated seller content as children. This repository must not import or reproduce that private logic.
- **Git flow:** We push to `dev` branch → also push `dev:main` → Railway auto-rebuilds at the **17th minute of every hour** → the backend owner's Next.js app picks up our latest build.
- **Rule:** NEVER push to main unless explicitly told. Always push to dev first, then dev:main when approved.

### Tech Stack
- **Vite 8** + **React 19** + **TypeScript 5.8**
- **lucide-react** for icons
- **Tailwind v3** installed (preflight DISABLED) — only for compatibility with the backend owner's Next.js wrapper, NOT used in our components
- All our styles use `ps-` prefixed CSS classes in `src/styles/`
- No routing library — custom hash-based router in `App.tsx`

### Key Files
| File | Purpose |
|------|---------|
| `src/App.tsx` | Router + page switching, cart state, theme toggle |
| `src/pages/market-pages.tsx` (759 lines) | Catalog page, Product page, Vendor pages, Reviews popup |
| `src/pages/commerce-pages.tsx` | Cart, checkout, order confirmation |
| `src/pages/home-page.tsx` | Homepage with hero + popular products |
| `src/pages/evidence-pages.tsx` | COA library, batch verification |
| `src/pages/content-pages.tsx` | FAQ, about, articles, shipping info |
| `src/pages/portal-pages.tsx` | Portal previews and the shared production seller workspace frame |
| `src/product-marketplace-view.tsx` | Shared standalone and production product-page structure |
| `src/product-page.tsx` | ProductPage frame components (Hero, DosageSelector, OfferCard) |
| `src/mock-data.ts` (1187 lines) | 82 products, 3 vendors, reviews, product details |
| `src/styles/tokens.css` | CSS variables (light + dark theme), modal base styles |
| `src/styles/storefront.css` (6068 lines) | All `ps-` component styles |
| `src/styles/shell.css` | Header, footer, navigation |
| `src/styles/responsive.css` | Mobile breakpoints |
| `src/styles/portal.css` | Vendor portal styles |
| `tailwind.config.js` | Tailwind v3 config (preflight: false) |
| `postcss.config.js` | PostCSS with tailwindcss + autoprefixer |

---

## Design System

### Colors (CSS variables in `tokens.css`)
```
--ps-accent: #ffa300          (orange — primary brand color, ALL buttons)
--ps-accent-hover: #eb9600
--ps-canvas: #f4f5f7           (page background)
--ps-paper: #ffffff            (card background)
--ps-surface: #eef1f4          (subtle surface)
--ps-ink: #12161d              (text)
--ps-muted: #5d6673             (secondary text)
--ps-line: #dfe3e8              (borders)
--ps-success: #167a53
--ps-danger: #a43737
```

Dark mode mirrors exist under `.ps-app[data-theme="dark"]`.

### Typography
- Font: "Avenir Next", Avenir, "Helvetica Neue", Helvetica, Arial, sans-serif
- Headings: tight letter-spacing (-0.065em for h1), font-weight 650
- Body: 1rem, line-height 1.7

### Layout
- Container: `width: min(100%, 80rem)` with `padding-inline: clamp(1rem, 3vw, 2.5rem)`
- Card radius: 16px
- Button radius: 10px
- Shadows: `--ps-shadow-soft` (0 18px 50px rgba(45,55,68,0.08)) and `--ps-shadow-raised` (0 26px 80px rgba(20,27,36,0.14))

### Buttons
- **ALL primary buttons are orange** (`--ps-accent: #ffa300`) with dark text (#15181d)
- No blue, green, or gray primary buttons anywhere
- `.ps-primary-action`, `.ps-outline-action`, `.ps-dark-link` all use orange

---

## Product Page (the most important page)

### Structure (`market-pages.tsx` → `ProductPage`)

```
ProductPage
├── ProductPageHero
│   ├── Back button (← Return to catalog)
│   ├── Product name (h1, e.g. "BPC-157")
│   ├── Description paragraph
│   ├── Details dl (CAS, Formula, MW)
│   └── DosageSelector (2mg / 5mg / 10mg buttons)
├── ProductOffersSection
│   ├── ps-offer-grid (2-column: vendor list + order summary)
│   │   ├── VendorOfferCardFrame (per vendor)
│   │   │   ├── ps-offer-heading
│   │   │   │   ├── ps-offer-vendor-info
│   │   │   │   │   ├── h3: "VendorName ★ 4.9" + VerifiedBadge (if verified)
│   │   │   │   │   └── p: "United States · 1–2 days"
│   │   │   │   └── Reviews button (opens popup)
│   │   │   ├── ps-offer-options (10 vials / 20 vials)
│   │   │   ├── ps-offer-facts (Purity, Batch, Dispatch, COA button)
│   │   │   └── ps-offer-action (qty selector + Add to Cart)
│   │   └── ps-cart-summary-card (sticky order summary)
│   └── (empty state if no vendors)
├── Waitlist modal (if product unavailable)
└── Reviews popup modal (if Reviews button clicked)
```

### Key conventions:
- **Stars + rating go to the RIGHT of vendor name**: `Northstar Research ★ 4.9`
- **Reviews button opens a POPUP, not a full page** — popup shows 5 recent reviews + "View all" link
- **No product images** on product pages — text-only (images only on homepage hero + popular section)
- **COA button** in facts row links to `/coas?vendor=X&product=Y`
- Cart persists via localStorage key `peptshop-cart`

### Vendor Pricing
Each vendor has a price multiplier applied to the base product price:
- Northstar Research: 1.0x (base price)
- Retalux: 1.08x (8% premium)
- Axiom Peptides: 0.94x (6% discount)

Pack size pricing: 20-vial pack = 1.9x the 10-vial price (bulk discount).

---

## Verified Shield Badge

### Logic
- Shield only appears when `vendor.verified === true` (set by admin, NOT automatic)
- Currently NO vendors have `verified: true` — so no shields show anywhere
- Mock data has `status: 'trusted'` on all vendors, but `verified` field doesn't exist (undefined → falsy)
- When admin grants verification, the `verified` field gets set to `true` and the shield appears

### Where it appears (all conditional on `verified`):
1. **Vendor card** on product page (next to vendor name, 14px)
2. **Reviews popup** header (next to vendor name, 18px)
3. **Vendors list** page (with "Verified vendor" label)
4. **Vendor profile** page (with "Verified vendor" label)

### Component (`VerifiedBadge` in `market-pages.tsx` line 262)
- Custom filled gold shield SVG (not lucide's thin outline)
- Gold fill `#FFA300` with darker gold border `#E08E00`
- White checkmark inside
- Hover tooltip: "Admin-verified vendor — identity and lab credentials confirmed by PeptShop staff."
- CSS class: `.ps-verified-badge` with `.ps-verified-tooltip`

---

## Reviews Popup

### Layout (matches main site's popup)
```
Modal (max-width 34rem, max-height 40vh, scrollable)
├── Header
│   ├── "VENDOR" kicker label
│   ├── Vendor name + VerifiedBadge (if verified)
├── Two metric cards (side by side)
│   ├── Average Rating (e.g. 4.9, "184 total reviews")
│   └── Recommendation Rate (96%, "Based on verified purchases")
├── Tab bar
│   ├── "Customer Reviews" (active by default)
│   └── "Certificates of Analysis"
├── Tab content
│   ├── Reviews tab: rating distribution bars (5★ to 1★) + 5 recent reviews + "View all" button
│   └── COA tab: product list with batch numbers, purity %, "View COA" buttons
```

### Reviews tab content:
- Rating distribution: 5 bars (5★=78%, 4★=14%, 3★=5%, 2★=2%, 1★=1%)
- 5 recent reviews from `VENDOR_REVIEWS` mock array
- Each review: buyer name, star string (★★★★☆), text, date + "Verified purchase"
- "View all {count} reviews" button → navigates to `/vendors/{slug}/reviews`

### COA tab content:
- Lists 6 available products with batch numbers and purity %
- Each row: FileCheck icon, product name, batch/purity, "View COA" button

---

## Mock Data (`mock-data.ts`)

### Products (82 total)
- IDs: `p1`, `p2`, ... `p82`
- Each has: id, name, slug, category, formats (dosages), startingPrice, vendorCount, availability, description
- Popular 6: PT-141, NAD+, Tesamorelin, GHK-Cu, Retatrutide, Semaglutide

### Vendors (3)
1. **Northstar Research** — US, rating 4.9, 184 reviews, 32 COAs, 1–2 day shipping, $12 shipping cost
2. **Retalux** — US, rating 4.8, 156 reviews, 28 COAs, 2–3 day shipping, $15 shipping cost
3. **Axiom Peptides** — EU, rating 4.7, 132 reviews, 21 COAs, 3–5 day shipping, $18 shipping cost

All have `status: 'trusted'` but NO `verified` field (so no shields display).

### Reviews
Mock reviews array with buyer names, star ratings, text, and dates.

---

## Checkout & Payments

### Two payment options:
1. **NOWPayments** — crypto payments (Bitcoin, Ethereum, etc.)
2. **PeerPay** (pay.peer.xyz) — card/fiat payments, 9% fee baked into total

### PeerPay Webhooks
- Express server on port 8787 at `<repo path>/webhooks/peerpay-server/`
- Cloudflare Worker at `<repo path>/webhooks/peerpay-worker/`
- 8 webhook events: ORDER_CREATED, ORDER_FULFILLED, ORDER_CANCELLED, ORDER_RESIZED, PAYMENT_SETTLED, PAYMENT_FAILED, PAYMENT_EXPIRED, PAYMENT_CANCELLED
- Not yet registered with PeerPay panel

### Escrow
- 100% escrow = all funds held (default)
- 50% = half pays immediately, half held 30 days
- the backend owner says 100% should be 0% (under discussion)

---

## Homepage

- **Hero section** with large heading + CTA button (orange)
- **Popular products** section — 6 products with images (ONLY place product images appear besides hero)
- Popular 6: PT-141, NAD+, Tesamorelin, GHK-Cu, Retatrutide, Semaglutide
- All homepage buttons are orange (#FFA300)

---

## Image Rules (CRITICAL)
- **Images ONLY on:** Homepage hero card + Popular products section
- **NO images on:** Catalog, product pages, cart, checkout, vendor pages
- Catalog is text-only (compound name, category, price, vendor count)
- Product pages are text-only (name, description, CAS/Formula/MW, vendor offers)

---

## Vial Color Convention (for future product images)
| Compound | Vial Color |
|----------|-----------|
| GHK-Cu | Blue + gold |
| NAD+ | Amber + copper |
| Tesamorelin / Cagriline | Blue |
| SS-31 / Epitalon / CJC No DAC | Purple |
| AOD / PT-141 / BPC / Semax / Reta / Tirz / MOTS-c / DSIP / Ipamorelin / TB-500 | Black |
| Kisspeptin | Gold |
| Glutathione | Amber |
| B12 | Red |
| 5-Amino-1MQ | Orange + black |
| GLOW | Gold + blue |
| KLOW | Black + blue |
| Blends | Short name, components in Formula, CAS/MW = N/A |

---

## Tailwind Situation
- Tailwind v3 installed with `preflight: false` (so it doesn't reset our `ps-` styles)
- `@tailwind utilities` added after `ps-` CSS imports in `src/frontend.css`
- On main site, the backend owner's Next.js wrapper adds `min-h-screen antialiased` to body — this is a Tailwind class that slightly changes our page background
- **NO Next.js rewrite needed** — the clash is CSS-only and manageable
- Our `ps-` CSS is authoritative (1,052 rules coexist with Tailwind on main)

---

## Git Workflow
```bash
# Normal flow
git add -A
git commit -m "Description of change"
git push origin dev          # push to dev
git push origin dev:main     # push to main (only when approved)

# Verify
git log --oneline -5
```

**Rules:**
- ONLY push to dev unless explicitly told to push to main
- Railway rebuilds at 17th minute of every hour (not a random delay)
- dev and main should be kept in sync after approved changes

---

## Testing
- **Dev server:** `http://the build server:5174/` (accessible via browser tools)
- **QA lane:** `https://www.peptshop.io/designer-qa/access` (public customer-facing routes only)
- **Main site:** `https://www.peptshop.io` (full site, but backend may be broken)
- **Build check:** `npx tsc --noEmit && npm run build` before every commit
- **Visual check:** Use `browser_navigate` + `browser_vision` to verify changes

### Important testing notes:
- `browser_navigate` causes full page reload (loses React state) — use SPA navigation to preserve cart
- Cart persists via localStorage `peptshop-cart`
- Main site vendor pages may be broken (the backend owner's backend issue, not ours)
- PeptAura backend removes all mock data — test on dev (Vite dev server)

---

## User Preferences (from memory)
- Approves fast — values brevity, don't re-litigate decisions
- Frustrated if asked the same question 3 times
- Expects proactive UI+UX audits during frontend work
- "Don't change till I tell you" = READ-ONLY, no commits/deploys until approved
- Security fixes: batch them, one build, one re-test
- LOGOS: BIG, fill space, consistent
- Scroll-to-top on form submit
- Suspended entities: greyed out + unclickable, small badge only
- English ONLY (Chinese in Discord is auto-translate, don't engage)
- Vial: BLUE-top lyophilized
- Anti-doxx: use `author_name` not real names
- Vendor dashboard: order number only (no customer details)
- Notifications: opt-in per vendor

---

## Pending Work
- Vendor signup page (requested, not built)
- Bulk CSV import identifiers (admin doesn't recognize `p1` format)
- Free shipping threshold notifications
- Bulk discount options
- Finnrick new vendor contacts
- PeerPay webhook URL registration with PeerPay panel
- Main site /vendors and /coas pages broken (the backend owner's backend)

---

## Current State (as of handoff)
- **dev and main both at `f210948`** — IN SYNC
- No uncommitted changes
- Vite dev server running on `0.0.0.0:5174`
- Express webhook server running on port 8787 (background)
- Last commit: "Shield only shows when admin verifies vendor + custom gold shield with tooltip"
- Hermes was just updated (665 new commits) — gateway needs restart from separate shell
