# PeptShop2 — Agent Instructions

## Architecture
- Vite + React + TypeScript. NOT Next.js.
- Catalog is text-only (no images on product pages).
- Images ONLY on hero section + popular products section (6 items: PT-141, NAD+, Tesamorelin, GHK-Cu, Retatrutide, Semaglutide).
- Logo color: #FFA300. Homepage buttons: all orange (#FFA300).
- Reviews: popup modal with tabs + metric cards. Paginated 10/page at /vendors/<slug>/reviews.
- COAs: removed from product pages. COA buttons route to /coas?vendor=X&product=Y, sorted latest-first.

## CSS Rules
- Dark theme on customer pages. Light theme on admin/seller pages.
- Seller pages scoped with `:has(.seller-page)` — dark only on customer pages.
- DO NOT rewrite the Next.js app (that's the backend owner's code on main branch).
- Use CSS variables that already exist. Match conventions.

## Git Policy
- ONLY push to dev branch. NEVER push to main unless explicitly told.
- Dev branch deploys to dev environment. Main deploys to production.
- Don't rollback deploys.

## Windows Path Rule
- Terminal runs git-bash/MSYS, NOT PowerShell. Use POSIX syntax.
- Use MSYS paths in terminal: `/c/Users/jmroc/...` not `C:\Users\jmroc\...`
- `read_file`, `write_file`, `patch` accept Windows paths fine — only `terminal` has the issue.

## Testing
- Test via the website (browser_navigate + snapshot/vision), not just `npx tsc --noEmit`.
- A passing TypeScript build is not a working feature.
- Verify subagent self-reports against the actual DOM.

## Payment
- NOWPayments for crypto. PeerPay (pay.peer.xyz) with 9% fee baked into total.
- Webhooks: Express port 8787 + CF Worker.

## Vial Color System
- GHK-Cu = blue + gold
- NAD+ = amber + copper
- Tesamo/Cagriline = BLUE
- SS-31/Epitalon/CJC No DAC = purple
- AOD/PT-141/BPC/Semax/Reta/Tirz/MOTS-c/DSIP/Ipamorelin/TB-500 = black
- Kisspeptin = gold
- Glutathione = amber
- B12 = red
- 5-Amino-1MQ = ORANGE + black
- GLOW = gold + BLUE
- KLOW = black + BLUE
- Blends: short name, components in Formula field, CAS/MW = N/A

## Platform Control
- WE CONTROL MAIN (frontend Vite app).
- the backend owner controls backend on main branch (Next.js, light theme).
- Dev branch = mock data. Main = real data via the backend owner's backend.
- Admin email: <admin email>
- Supabase magic links for auth (no password). Links are session/IP-bound.