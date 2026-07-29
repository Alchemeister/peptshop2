# PeptShop frontend

**Stack:** Vite + React + TypeScript. Built with `npm run build` (tsc + Vite).

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

## Test the reviewed frontend in production

The private application provides a protected production QA lane at:

`https://www.peptshop.io/designer-qa/access`

This lane verifies the reviewed frontend revision, production asset delivery, responsive layout,
theme behavior, in-preview navigation, and the callback boundary. It uses synthetic presentation
records only. It also provides a separate, expiring fake-order store for testing the checkout and
order lifecycle. It does not connect this repository to production data or private business logic.

To run a QA pass:

1. Push the frontend change to the repository's `main` branch.
2. Wait for the private application to synchronize and deploy the reviewed revision.
3. Open the QA access page and enter the access code shared through a private channel. The access
   form does not require a personal account, name, or email.
4. Use **Page explorer** to move through the available production QA routes and test both themes.
5. To place a fake order, open **Cart** and continue through checkout using only these reserved
   values:
   - Email: `qa+designer@example.test`
   - Full name: `QA Tester`
   - Street: `100 Test Street`
   - City: `Testville`
   - State or region: `NY`
   - Postal code: `00000`
   - Country: `United States`
6. Select **Place order**. The safety bar shows a QA receipt and opens the persisted synthetic order.
   The order is also available from **QA orders** and the order-status presentation. Creation sends
   a clearly marked QA-only order email to Resend's controlled test sink. It never sends to the
   reserved `example.test` address or to a customer, seller, operator, or user-selected recipient.
7. In **QA orders**, test the fixed fake lifecycle: confirm fake payment, accept, mark shipped, mark
   delivered, cancel where available, or simulate a fake refund. Each transition produces another
   QA receipt, updates the imported order-status layout, and sends a sanitized QA-only status email
   to the same fixed test sink.
8. Before advancing to the next state, confirm that the order card says **QA email accepted by test
   sink**. If it reports a failure, use **Retry QA email**. Lifecycle actions remain disabled until
   the current synthetic event's email is accepted.
9. Refresh or sign in again to confirm persistence. Fake orders expire after seven days, and the
   shared QA workspace holds at most 50 active orders.
10. Exercise other visible forms and controls. Presentation-only callbacks still return ephemeral QA
   receipts without performing a live action.
11. Report the tested route, viewport, browser, steps, expected result, actual result, and screenshot.
   Include the QA receipt when the issue concerns a callback.
12. End the session with **Sign out of QA**. Sessions also expire automatically.

The production QA lane deliberately excludes private role workspaces and any surface that could
suggest real commercial terms. Local preview content for those layouts remains illustrative only.

Security rules:

- Never put the access code in a URL, commit, issue, chat screenshot, or browser recording.
- Never enter a real customer identity, address, order number, batch, vendor record, or payment
  detail. The order API rejects identities and addresses outside the reserved synthetic format.
- Never describe preview values as live marketplace facts.
- If the QA safety bar is absent, stop. You are no longer inside the isolated lane.
- Send only the route, reproduction steps, visual evidence, and QA receipt in a bug report.

The lane does not expose database access, authentication records, environment values, provider
credentials, private algorithms, internal economics, or incentive terms. Synthetic orders are
stored in an isolated server-only table and cannot invoke real payments, inventory changes,
customer or seller notifications, fulfillment, seller actions, staff actions, or administrative
actions. The private host sends only a sanitized event summary to Resend's documented fixed test
sink; no recipient can be supplied from the browser. Delivery records contain only the synthetic
event, delivery state, and provider message ID. Order updates accept only fixed fake transitions.

## Where to edit

- `src/pages/home-page.tsx`: homepage.
- `src/pages/market-pages.tsx`: catalog, product, vendor directory, and vendor profile.
- `src/pages/evidence-pages.tsx`: COA library, verification, and submission.
- `src/pages/commerce-pages.tsx`: cart, checkout, payment, and private customer actions.
- `src/pages/content-pages.tsx`: policies, FAQ, contact, articles, and API documentation layout.
- `src/pages/portal-pages.tsx`: login, admin, staff, and affiliate previews, plus
  `SellerWorkspaceFrame`, which owns the production `/seller` sidebar, top bar, canvas, spacing,
  and responsive layout.
- `src/admin-pricing.tsx`: editable admin pricing and availability presentation.
- `src/admin-pricing.module.css`: scoped pricing workspace styles used by preview and production.
- `src/order-status.module.css`: production order lookup, access gate, timeline, and shipment styles.
- `src/email-theme.ts`: presentation-only color tokens used by the private email renderer.
- `src/styles/`: tokens, storefront styles, portal styles, and responsive rules.
- `src/contracts.ts`: view models and callback boundary supplied by the private application.
- `src/route-manifest.ts`: every route family owned by this presentation repository.
- `src/mock-data.ts`: fake content used only by this preview.
- `src/preview-fixtures.ts`: deliberately synthetic admin and offer fixtures.

The product page retains smaller exported frame components because the private application already
consumes them directly. The other route-level components use the same model-and-callback boundary.
The private application also consumes `AdminPricingSurface` and `SellerWorkspaceFrame` directly.
`SellerWorkspaceFrame` receives a display title, callbacks, and an opaque child slot containing the
authenticated seller tools. Its props contain no database access or private business rules.

## Scope exclusions

Group testing, RFQs, and pooled ordering are not part of this frontend. They should not be added to
navigation, route coverage, or page designs.

## Integration rule

The frontend may render sanitized values and call functions passed through props. It must never
query the database, calculate private prices, decide access, mutate orders, send emails, process
payments, or read environment variables.

See `INTEGRATION_CONTRACT.md`, `ROUTE_COVERAGE.md`, and `PUBLISHING.md` before returning changes.

No `.env` file is required or supported.
