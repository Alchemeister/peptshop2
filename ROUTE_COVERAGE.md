# Route coverage

The presentation router groups related production URLs into shared, editable page families.
Dynamic segments are represented with `:name`.

| Family | Routes |
| --- | --- |
| Homepage | `/` |
| Catalog | `/products`, `/peptides` |
| Product detail | `/catalog/:name`, `/products/:slug`, `/product/:id`, `/peptides/:slug` |
| Vendor directory | `/vendors` |
| Vendor profile | `/vendors/:supplier`, `/vendors/:supplier/catalog`, `/supplier/:supplier` |
| Evidence | `/coas`, `/verify`, `/submit-coa`, `/coa/submit-coa` |
| Commerce | `/cart`, `/checkout`, `/:locale/checkout`, `/payment` |
| Customer actions | Order status, delivery, tracking, refund, review, campaign, research, dispute, and private-link routes listed in `src/route-manifest.ts` |
| Company and support | `/about`, `/contact`, `/faq`, `/shipping`, `/privacy`, `/privacy-policy`, `/terms`, `/disclaimers` |
| Library | `/articles`, `/articles/:slug`, `/khavinson` |
| Authentication | `/login`, `/login/check-email`, `/auth/reset-password`, `/auth/update-password` |
| Seller | `/seller`, `/seller/escrow-gate` |
| Admin | `/admin`, `/admin/pricing`, `/panel`, and `/local/admin/*` |
| Staff | `/staff` and `/staff/*` |
| Affiliate | `/affiliate`, `/local/affiliates` |
| API documentation | `/docs/api` |
| Localized public pages | `/:locale/*` |

Explicitly excluded from the product scope:

- `/group-testing` and descendants
- `/rfq` and descendants
- `/pools` and descendants

Every excluded family must remain absent from navigation and preview pages.
