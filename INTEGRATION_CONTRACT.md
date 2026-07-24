# Integration contract

The private PeptShop application owns data, authentication, authorization, business rules, and all
side effects. This repository owns layout, styles, responsive behavior, visible states, and
presentational interaction.

## Public entrypoints

- `PeptShopFrontend`: complete standalone preview and optional embedded presentation router.
- Route components exported from `src/index.ts` for adapter-driven integration.
- Product-page frame components exported from `src/product-page.tsx`.
- `AdminPricingSurface` and its display-only types exported from `src/admin-pricing.tsx`.
- `src/frontend.css`: global design system for the standalone and route-level components.
- `src/product-page.module.css`: locally scoped product presentation styles.
- `src/admin-pricing.module.css`: locally scoped admin pricing styles.

## Values supplied by the private application

`PeptShopViewModels` contains sanitized products, vendors, COAs, cart lines, orders, and portal
metrics. These are display objects, not database rows. Add display fields deliberately when a page
needs them. Do not pass service credentials, internal notes, access policy fields, raw payment
records, or unrestricted customer data.

`PeptShopActions` contains callbacks for navigation, search, cart changes, checkout, email intents,
login, COA submission, batch verification, vendor creation, seller operations, and admin
operations. The frontend may invoke a callback. It may not implement the operation.

The production adapter currently supplies:

- Product formats, warehouse regions, per-measure starting price, price unit, pack size, active
  vendor count, published COA count, and an approved presentation image.
- Public vendor display name, country, rating, review count, fulfillment time, recommendation
  score, ordering availability, warehouse regions, and public COA count.
- A request-derived vendor-directory shipping link containing only its display label and href.
- Public COA display fields and an optional application-approved report URL.
- Cart lines plus update, remove, clear, and begin-checkout callbacks.

Optional values must render an honest empty or unavailable state. The standalone preview may use
mock values, but production-facing components must never invent a vendor, laboratory, batch,
region, COA, price, or availability claim when the private adapter omits it.

## Logic that stays private

- Database clients, SQL, project identifiers, and environment variables.
- Sessions, magic links, passwords, role checks, and row-level access.
- Catalog queries, vendor visibility, price projection, discounts, tax, and shipping eligibility.
- Stock, batch, COA visibility, and publication decisions.
- Cart validation, checkout orchestration, payment routing, escrow, refunds, and payouts.
- Order mutations, vendor onboarding, emails, webhooks, rate limits, and audit logs.

The private application imports the route components directly. It supplies only serialized view
models and callbacks, so this repository cannot query Supabase or inspect sessions, environment
variables, wallets, payment credentials, or authorization policy.

## Stable product exports

The live product adapter currently consumes these names directly:

- `ProductPageFrame`
- `ProductPageHero`
- `ProductBackControlFrame`
- `ProductDosageSelectorFrame`
- `ProductDosageOptionFrame`
- `ProductUnavailableState`
- `ProductAboutSection`
- `ProductOffersSection`
- `ProductFilterEmptyState`
- `CompoundWaitlistTitle`
- `CompoundWaitlistDescription`
- `CompoundWaitlistForm`
- `VendorOfferCardFrame`
- `VendorOfferOptionFrame`

Changing their prop signatures requires a coordinated private adapter update. Visual markup and CSS
may otherwise be changed freely.

## Admin vendor creation

The `AdminPage` renders the form and calls `createVendor(form)`. The private adapter must verify an
admin session, validate and normalize fields, create the vendor and access records transactionally,
write an audit event, and return a safe result. None of that implementation belongs here.

## Admin pricing

`AdminPricingSurface` receives sanitized vendor and catalog display objects. It emits selected
vendor IDs and edited price-tier fields through `onSelectVendor` and `onSave`. The private adapter
must authenticate the administrator again, validate each tier, verify that the listing belongs to
the selected vendor, apply the database mutation, and expire catalog caches.

The standalone `/admin/pricing` route uses mock records and a mock save response. It cannot change
production data. Visual markup, copy, responsive behavior, and styles may be changed freely as long
as the exported prop contract remains compatible with the private adapter.

## Security gate

`npm run check` fails if frontend source introduces database packages, Next.js server imports,
environment reads, network fetches, internal path aliases, or excluded route links.
