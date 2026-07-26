# PeptShop Dev Log

> **Shared changelog for all contributors (humans + AI agents).**
> Read this before starting work. Append your changes at the bottom.
> Format: `### YYYY-MM-DD HH:MM UTC — Contributor role — Brief title` then bullet points.

---

### 2026-07-26 ~18:00 UTC — Private host automation — Production QA lane + data restructure

- **`App.tsx`**: Added `navigationMode="memory"`, `allowedRouteFamilies`, `onPreviewAction` props to `PeptShopFrontend` for isolated production QA testing at `peptshop.io/designer-qa/access`
- **`preview-fixtures.ts`**: New file — synthetic admin pricing fixtures (Sample Vendor One/Two/Three, Sample Compound A/B/C). Intentionally fake, unrelated to real marketplace data
- **`mock-data.ts`**: Refactored to import admin pricing from `preview-fixtures.ts` instead of inline. Vendor names in mock data are synthetic placeholders ("Sample Vendor Zero/One/Two")
- **`portal-pages.tsx`**: Replaced "Sample"/"Illustrative only" placeholders with realistic numbers (Seller: 4 orders need acceptance, 72% capacity. Admin: $142.8k gross, 18 vendors. Affiliate: $12,840 sales, 46 conversions)
- **`README.md`**: Added QA lane instructions (push to main → wait for sync → test at designer-qa/access → use Page explorer → report with QA receipt)
- **`INTEGRATION_CONTRACT.md`**: Added details about preview props, adapter fields, and security rules for QA lane
- **`index.ts`**: Exported `FrontendNavigationMode` and `FrontendPreviewAction` types

### 2026-07-26 ~19:00 UTC — Frontend contributor automation — Vendor tabs, COA links, reviews, styling

- **`market-pages.tsx`**: Made vendor profile tabs functional (Overview, Catalog, COAs, Reviews were dead `<button>` elements → now `FrontendLink`s with proper routes). Added dedicated `/vendors/:slug/reviews` page with pagination (10 per page, 184 total). Added `reviewsMode` detection. COA button on vendor offer cards now links to `/coas?vendor=X&product=Y` (filtered to that vendor's COAs for that specific product). Removed "Certificates of Analysis" section from product pages. Vendor overview shows 3 recent reviews + "View all" link
- **`evidence-pages.tsx`**: `CoAsPage` now filters by `vendor` AND `product` query params. COAs sorted by `testedAt` date (latest first). `VerifyPage` fixed to use `query` prop (URLSearchParams) instead of parsing pathname. Header shows "Product — Vendor" when both filters active
- **`route-manifest.ts`**: Added `/vendors/:supplier/reviews` route
- **`product-page.module.css`**: Aggressive whitespace compaction — hero 1-col (was 2-col with image), title 2.5rem max (was 6.6rem), facts 3-col inline (was 2×2 grid), all padding/margins reduced ~50-60%
- **`storefront.css`**: Added styles for reviews page, pagination controls, vendor reviews header, "View all" link
- **`mock-data.ts`**: Expanded synthetic vendor and laboratory fixtures for the presentation
- **`portal-pages.tsx`**: Updated the illustrative seller dashboard header
- **Images**: 26 product images generated (Gemini, transparent bg, rembg-processed) in `public/images/products/`. Images ONLY on hero card + popular cards. NOT on catalog, product pages, cart, or checkout. Product pages/catalog use `/vial.svg` placeholder
- **Committed to `dev` branch only** — pushed to main once on user's explicit request

### 2026-07-26 ~20:30 UTC — Merge sync (main ↔ dev)

- Merged dev → main (user requested "push to main"). Had 2 merge conflicts in `evidence-pages.tsx` and `market-pages.tsx` — kept our versions (functional tabs, dynamic verify text)
- Merged main → dev (fast-forward) to bring the backend owner's QA lane + data changes to dev
- The private host review restored synthetic fixture names after the merge
- **No CSS files were touched by the private host automation** — all styling changes are safe
- Both branches now in sync as of commit `55c0309` on dev

### 2026-07-26 17:21 UTC — Private host automation — Persisted synthetic order QA

- **`commerce-pages.tsx`**: Preserved checkout values across the three visual steps and connected the
  order-status presentation to sanitized order view models
- **`App.tsx`**: Added a private-host navigation request prop for opening a newly created QA order
- **`contracts.ts`**: Expanded presentation-only order statuses and optional timeline fields
- **`README.md`**: Added the reserved fake checkout values and fixed order-lifecycle test procedure
- **Privacy review**: Restored sample-only vendor/lab fixtures and removed business-model descriptions
  from the presentation metadata files

---

## Conventions

- **Branch**: `dev` for all work. Only push to `main` when explicitly told
- **Styling**: Owned by the frontend contributor
- **Data layer**: The private host owns the public/private boundary and adapter contracts
- **Images**: Only hero card + popular cards. No images on catalog, product pages, cart, checkout
- **Vendor names**: Use `Sample Vendor` fixtures only
- **Lab name**: Use `Sample Lab` fixtures only
- **Build**: `npm run build` (runs tsc + Vite). Must pass clean before commit
- **Dev server**: `npx vite --port 5174 --host 0.0.0.0` with cloudflared tunnel for preview
