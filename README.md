# PeptShop frontend

This is the complete presentation workspace for PeptShop. It covers the homepage, catalog, product
details, vendors, COAs, batch verification, COA submission, cart, checkout, payment, private order
flows, support and policy pages, articles, authentication, seller, staff, affiliate, and admin.

It is intentionally disconnected from the private application. There is no Supabase client,
database credential, API route, server action, authentication implementation, payment logic, or
private marketplace rule in this repository. All preview content is fake.

## Run the design workspace

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:5173`. Use the **Page explorer** button in the lower-right corner to switch
between route families and light or dark themes. Links inside the preview also navigate normally.

Run the full local gate with:

```bash
npm run build
```

The build checks the public/private boundary, TypeScript, and the production Vite bundle.

## Where to edit

- `src/pages/home-page.tsx`: homepage.
- `src/pages/market-pages.tsx`: catalog, product, vendor directory, and vendor profile.
- `src/pages/evidence-pages.tsx`: COA library, verification, and submission.
- `src/pages/commerce-pages.tsx`: cart, checkout, payment, and private customer actions.
- `src/pages/content-pages.tsx`: policies, FAQ, contact, articles, and API documentation layout.
- `src/pages/portal-pages.tsx`: login, seller, admin, staff, and affiliate workspaces.
- `src/admin-pricing.tsx`: editable admin pricing and availability presentation.
- `src/admin-pricing.module.css`: scoped pricing workspace styles used by preview and production.
- `src/order-status.module.css`: production order lookup, access gate, timeline, and shipment styles.
- `src/email-theme.ts`: presentation-only color tokens used by the private email renderer.
- `src/styles/`: tokens, storefront styles, portal styles, and responsive rules.
- `src/contracts.ts`: view models and callback boundary supplied by the private application.
- `src/route-manifest.ts`: every route family owned by this presentation repository.
- `src/mock-data.ts`: fake content used only by this preview.

The product page retains smaller exported frame components because the private application already
consumes them directly. The other route-level components use the same model-and-callback boundary.
The private application also consumes `AdminPricingSurface` directly. Its props contain sanitized
display records and callbacks only.

## Scope exclusions

Group testing, RFQs, and pooled ordering are not part of this frontend. They should not be added to
navigation, route coverage, or page designs.

## Integration rule

The frontend may render sanitized values and call functions passed through props. It must never
query the database, calculate private prices, decide access, mutate orders, send emails, process
payments, or read environment variables.

See `INTEGRATION_CONTRACT.md`, `ROUTE_COVERAGE.md`, and `PUBLISHING.md` before returning changes.

No `.env` file is required or supported.
