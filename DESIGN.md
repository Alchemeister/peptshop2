# PeptShop design direction

## Design read

PeptShop is a trust-first research marketplace. The interface should feel like a precise market
desk with editorial restraint, not a supplement store, healthcare dashboard, or generic SaaS kit.
The existing orange identity remains the single accent. Product, vendor, batch, shipping, and price
relationships stay legible at a glance.

## Dials

- Design variance: 7 out of 10
- Motion intensity: 3 out of 10
- Visual density: 5 out of 10 for the storefront, 7 out of 10 for portals
- Shape system: 16px feature surfaces, 14px page surfaces, 10px controls, circles only for status
- Accent: PeptShop orange only
- Storefront themes: light and dark
- Portal theme: compact neutral operations UI

## Visual system

- Use near-black ink, white paper, cool neutral canvas, and PeptShop orange.
- Use generous editorial spacing on public pages and compact tables in operational workspaces.
- Use one clear surface level. Do not nest decorative cards inside decorative cards.
- Let large type, dividers, product images, and data hierarchy carry the composition.
- Use monospace only for batch numbers, addresses, API paths, and normalized price facts.
- Keep images grounded with simple fields and shadows. Do not fake browser screenshots in HTML.
- Use Lucide icons consistently at a light stroke weight.

## Interaction rules

- Every control must expose hover, active, focus, disabled, loading, empty, and error behavior when
  that state applies.
- Keep motion short and interruptible. Honor `prefers-reduced-motion`.
- Preserve 44px minimum touch targets for primary mobile actions.
- Collapse multi-column tables into labeled rows instead of forcing horizontal zoom.
- The route explorer is preview tooling. It is not a production storefront component.

## Anti-patterns

- No inherited warm beige palette.
- No purple gradients or decorative glow systems.
- No generic three-card feature row.
- No pill-shaped container for every label.
- No six-line hero headline.
- No visible medical, dosing, or consumption language.
- No backend status or secret data invented in the frontend.

## Copy rule

Visible copy must be direct and evidence-aware. Avoid em dashes and en dashes. Use approved private
application content for policies, product research text, and operational messages in production.
