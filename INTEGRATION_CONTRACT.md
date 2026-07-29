# Integration contract

The private PeptShop application owns data, authentication, authorization, business rules, and all
side effects. This repository owns layout, styles, responsive behavior, visible states, and
presentational interaction.

## Public entrypoints

- `PeptShopFrontend`: complete standalone preview and optional embedded presentation router.
- Route components exported from `src/index.ts` for adapter-driven integration.
- `ProductMarketplaceView` and its sanitized product/offer display types, exported from
  `src/product-marketplace-view.tsx`.
- Lower-level product-page frame components exported from `src/product-page.tsx`.
- `AdminPricingSurface` and its display-only types exported from `src/admin-pricing.tsx`.
- `SellerWorkspaceFrame`, which owns the production seller sidebar, top bar, canvas, spacing, and
  responsive layout while accepting the private operational workspace as children.
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

For an isolated host preview, `PeptShopFrontend` also accepts:

- `navigationMode="memory"` to keep preview navigation inside the mounted surface.
- `allowedRouteFamilies` to limit which presentation families can be reached.
- `onPreviewAction`, which emits only a fixed action name. It never emits form fields, identities,
  prices, credentials, or other entered values.

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

The catalog defaults to available-only when at least one live offer exists. When a clean database
contains peptide records but no offers yet, it defaults to the complete watchlist so those imported
compounds remain discoverable.

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

## Seller workspace

The live `/seller` route consumes `SellerWorkspaceFrame` directly. This repository owns the frame's
markup and CSS, including navigation presentation, top-bar presentation, page width, spacing, and
responsive behavior. The private application owns the authenticated child content, supplier
lookup, data loading, tabs, mutations, escrow gates, and sign-out operation.

The stable seller frame inputs are:

- `actions`: presentation callbacks, including navigation and the availability intent.
- `pathname`: the current route used for navigation presentation.
- `title`: the authorized supplier display title.
- `environmentLabel`: an optional safe workspace label.
- `onSignOut`: an optional callback implemented by the private host.
- `children`: an opaque React node. The frontend must not inspect or transform private data inside
  this slot.

Changing the seller frame's visual markup and CSS is allowed. Changing these inputs requires a
coordinated private adapter update.

## Stable product exports

The live `/catalog/[name]` route consumes `ProductMarketplaceView` directly. This repository owns
the product hero, dosage selector, vendor cards, offer grid, order summary, spacing, responsive
behavior, and their CSS. The private application supplies live catalog values and callback
implementations through:

- `ProductMarketplaceModel`
- `ProductMarketplaceDosage`
- `ProductMarketplaceOffer`
- `ProductMarketplaceOption`
- `ProductMarketplaceAction`
- `ProductMarketplaceSelection`

The model must contain only customer-safe display fields. The private callback decides whether the
selected option adds a validated catalog item to the cart, opens an approved waitlist flow, or
remains disabled. Preview offers may be synthetic; the private adapter must never derive live
prices or availability from preview math.

The BAC Water specialty page and supporting states also consume these lower-level names directly:

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

Changing the shared view-model or frame prop signatures requires a coordinated private adapter
update. Visual markup and CSS may otherwise be changed freely.

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

All standalone pricing and portal fixtures must be obviously synthetic. They must never be copied
from private supplier records, private prices, commercial terms, incentive rules, or production
analytics.

## Security gate

`npm run check` fails if frontend source introduces database packages, Next.js server imports,
environment reads, network fetches, internal path aliases, or excluded route links.
