// CSS rules that the backend owner's build pipeline purges from storefront.css.
// These are injected at runtime via <style> tag to bypass the purge.
// DO NOT EDIT MANUALLY — generated from storefront.css.
export const PURGED_CSS = `#ps-storefront .ps-coa-table{margin-top: 1.5rem;
  border-top: 1px solid var(--ps-line-strong);}
#ps-storefront .ps-coa-empty-state{padding: 3rem 1.5rem;
  text-align: center;
  color: var(--ps-muted);}
#ps-storefront .ps-coa-empty-state svg{color: var(--ps-muted); margin-bottom: 0.75rem;}
#ps-storefront .ps-coa-empty-state p{font-size: 1.05rem; font-weight: 600; margin: 0 0 0.25rem; color: var(--ps-ink);}
#ps-storefront .ps-coa-empty-state small{font-size: 0.875rem;}
#ps-storefront .ps-coa-table-head,

#ps-storefront .ps-coa-row{display: grid;
  grid-template-columns: minmax(10rem, 1.2fr) minmax(9rem, 0.9fr) minmax(10rem, 1fr) minmax(7rem, 0.7fr) minmax(6rem, 0.55fr) auto;
  gap: 0.8rem;
  align-items: center;}
#ps-storefront .ps-coa-table-head{min-height: 2.7rem;
  color: var(--ps-faint);
  font-size: 0.6rem;
  font-weight: 720;
  letter-spacing: 0.06em;
  text-transform: uppercase;}
#ps-storefront .ps-coa-row{min-height: 6rem;
  border-top: 1px solid var(--ps-line);}
#ps-storefront .ps-coa-row > div{display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 0.25rem;}
#ps-storefront .ps-coa-row strong{overflow: hidden;
  font-size: 0.77rem;
  font-weight: 650;
  text-overflow: ellipsis;
  white-space: nowrap;}
#ps-storefront .ps-coa-row small{color: var(--ps-faint);
  font-family: "SFMono-Regular", Consolas, monospace;
  font-size: 0.62rem;}
#ps-storefront .ps-coa-row > button,

#ps-storefront .ps-coa-row > a,

#ps-storefront .ps-coa-row > .ps-coa-link-unavailable{display: grid;
  width: 2.4rem;
  height: 2.4rem;
  place-items: center;
  border: 1px solid var(--ps-line);
  border-radius: 9px;
  background: var(--ps-paper);
  color: var(--ps-ink);
  text-decoration: none;}
#ps-storefront .ps-coa-row > .ps-coa-link-unavailable{color: var(--ps-faint);}
/* ============================================
   COA section: items
   =========================================== */
#ps-storefront .ps-coa-item{display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.875rem 1rem;
  border: 1px solid var(--ps-line);
  border-radius: 10px;
  margin-bottom: 0.5rem;
  background: var(--ps-paper);}
#ps-storefront .ps-coa-item > div{display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--ps-ink);}
#ps-storefront .ps-coa-item > span{font-size: 0.8125rem;
  color: var(--ps-muted);}
#ps-storefront .ps-coa-item > button{display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--ps-accent);
  background: transparent;
  border: 1px solid var(--ps-line);
  border-radius: 8px;
  padding: 0.4rem 0.7rem;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s ease;}
#ps-storefront .ps-coa-item > button:hover{border-color: var(--ps-accent);
  background: rgba(255, 200, 100, 0.06);}
#ps-storefront .ps-coa-pending{opacity: 0.65;
  border-style: dashed;}
#ps-storefront .ps-coa-pending > button{color: var(--ps-muted);}
#ps-storefront .ps-coa-list{display: flex;
  flex-direction: column;
  gap: 0.5rem;}
/* ===== CoA library page styling — make Tailwind table match storefront ===== */
/* Override the backend owner's hardcoded Tailwind light-theme colors inside CoA page.
   NOTE: the backend owner's build strips !important and purges span/div selectors.
   Unlayered CSS beats Tailwind's @layer utilities, so no !important needed.
   We avoid span/div selectors (purged) and use element + attribute selectors.
   Scoped with :not(:has(.dark)) to exclude admin/seller dark-theme pages. */
#ps-storefront .ps-private-surface:not(:has(.dark)){background: var(--ps-paper);
  border: 1px solid var(--ps-line);
  border-radius: 16px;
  padding: 1.5rem;
  color: var(--ps-ink);}
/* Force the the backend owner wrapper div to use our dark theme */
#ps-storefront .ps-private-surface:not(:has(.dark)) [class*="bg-[#F8FAFC]"],
#ps-storefront .ps-private-surface:not(:has(.dark)) [class*="min-h-screen"]{background: var(--ps-paper);
  color: var(--ps-ink);}
/* White card containers with light borders → dark cards */
#ps-storefront .ps-private-surface:not(:has(.dark)) [class*="bg-white"],
#ps-storefront .ps-private-surface:not(:has(.dark)) [class*="bg-[#FFFFFF]"],
#ps-storefront .ps-private-surface:not(:has(.dark)) [class*="rounded-xl"],
#ps-storefront .ps-private-surface:not(:has(.dark)) [class*="overflow-hidden"]{background: var(--ps-surface);
  border-color: var(--ps-line);
  box-shadow: none;
  color: var(--ps-ink);}
/* Slate-900 backgrounds on buttons → our accent or surface */
#ps-storefront .ps-private-surface:not(:has(.dark)) button[class*="bg-[#0F172A]"]{background: var(--ps-accent);
  border-color: var(--ps-accent);
  color: var(--ps-ink);}
/* Form with light theme */
#ps-storefront .ps-private-surface:not(:has(.dark)) form{background: var(--ps-surface);
  border-color: var(--ps-line);
  color: var(--ps-ink);
  border-radius: 12px;}
/* Filter form inputs */
#ps-storefront .ps-private-surface:not(:has(.dark)) form button,
#ps-storefront .ps-private-surface:not(:has(.dark)) form [role="combobox"],
#ps-storefront .ps-private-surface:not(:has(.dark)) form [class*="date-picker"]{background: var(--ps-paper);
  border: 1px solid var(--ps-line);
  color: var(--ps-ink);}
/* Slate-500/600/400 label text → our muted color */
#ps-storefront .ps-private-surface:not(:has(.dark)) [class*="text-[#64748B]"],
#ps-storefront .ps-private-surface:not(:has(.dark)) [class*="text-[#475569]"],
#ps-storefront .ps-private-surface:not(:has(.dark)) [class*="text-slate-500"],
#ps-storefront .ps-private-surface:not(:has(.dark)) [class*="text-slate-600"],
#ps-storefront .ps-private-surface:not(:has(.dark)) [class*="text-slate-400"]{color: var(--ps-muted);}
/* Slate-900 text → our ink color */
#ps-storefront .ps-private-surface:not(:has(.dark)) [class*="text-[#0F172A]"],
#ps-storefront .ps-private-surface:not(:has(.dark)) [class*="text-slate-900"]{color: var(--ps-ink);}
/* Slate-900/55 muted text */
#ps-storefront .ps-private-surface:not(:has(.dark)) [class*="text-[#0F172A]\/55"],
#ps-storefront .ps-private-surface:not(:has(.dark)) [class*="text-[#0F172A]\/50"]{color: var(--ps-muted);}
/* Light borders → our line color */
#ps-storefront .ps-private-surface:not(:has(.dark)) [class*="border-[#CBD5E1]"],
#ps-storefront .ps-private-surface:not(:has(.dark)) [class*="border-slate-300"],
#ps-storefront .ps-private-surface:not(:has(.dark)) [class*="border-slate-200"]{border-color: var(--ps-line);}
/* Table container */
#ps-storefront .ps-private-surface:not(:has(.dark)) table{width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-family: "Avenir Next", Avenir, "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 0.88rem;
  background: var(--ps-paper);}
#ps-storefront .ps-private-surface:not(:has(.dark)) thead,
#ps-storefront .ps-private-surface:not(:has(.dark)) thead tr{background: var(--ps-surface);
  border-color: var(--ps-line);}
#ps-storefront .ps-private-surface:not(:has(.dark)) thead th{text-align: left;
  font-weight: 700;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--ps-muted);
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--ps-line);
  background: var(--ps-surface);}
#ps-storefront .ps-private-surface:not(:has(.dark)) tbody td{padding: 0.85rem 1rem;
  border-bottom: 1px solid var(--ps-line);
  color: var(--ps-ink);
  vertical-align: middle;
  background: var(--ps-paper);}
#ps-storefront .ps-private-surface:not(:has(.dark)) tbody tr{border-color: var(--ps-line);}
#ps-storefront .ps-private-surface:not(:has(.dark)) tbody tr:last-child td{border-bottom: none;}
#ps-storefront .ps-private-surface:not(:has(.dark)) tbody tr:hover td{background: var(--ps-surface);}
#ps-storefront .ps-private-surface:not(:has(.dark)) h1,
#ps-storefront .ps-private-surface:not(:has(.dark)) h2,
#ps-storefront .ps-private-surface:not(:has(.dark)) h3{font-family: "Avenir Next", Avenir, "Helvetica Neue", Helvetica, Arial, sans-serif;
  letter-spacing: -0.03em;
  font-weight: 650;
  color: var(--ps-ink);}
#ps-storefront .ps-private-surface:not(:has(.dark)) p{color: var(--ps-muted);
  font-family: "Avenir Next", Avenir, "Helvetica Neue", Helvetica, Arial, sans-serif;
  line-height: 1.6;}
#ps-storefront .ps-private-surface:not(:has(.dark)) a{color: var(--ps-accent);
  font-weight: 600;
  text-decoration: none;}
#ps-storefront .ps-private-surface:not(:has(.dark)) a:hover{color: var(--ps-accent-hover);}
#ps-storefront .ps-private-surface:not(:has(.dark)) button{font-family: "Avenir Next", Avenir, "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-weight: 700;
  border-radius: 10px;}
/* Filter inputs and buttons */
#ps-storefront .ps-private-surface:not(:has(.dark)) input,
#ps-storefront .ps-private-surface:not(:has(.dark)) select{background: var(--ps-paper);
  border: 1px solid var(--ps-line);
  color: var(--ps-ink);
  border-radius: 8px;}
#ps-storefront .ps-private-surface:not(:has(.dark)) input::placeholder{color: var(--ps-muted);}
/* Badges */
#ps-storefront .ps-private-surface:not(:has(.dark)) [class*="rounded-full"]{border-color: var(--ps-line);}
/* "PeptShop Submitted" badge: black bg → our accent */
#ps-storefront .ps-private-surface:not(:has(.dark)) [class*="bg-black"]{background: var(--ps-accent);
  color: var(--ps-ink);}
/* ──────────────────────────────────────────────────────────────
   Admin / seller dark-theme pages (.ps-private-surface:has(.dark))
   the backend owner's admin uses bg-[#070D18] + text-white. We inject our
   design system: Avenir Next fonts, orange accent, card styling,
   table formatting — matching PeptShop's dark theme.
   NOTE: the backend owner strips !important and purges span/div selectors.
   Use element + attribute selectors only. Unlayered beats @layer.
   ────────────────────────────────────────────────────────────── */

/* Define dark-theme CSS vars on the admin wrapper */
#ps-storefront .ps-private-surface:has(.dark){--admin-accent: #ffa300;
  --admin-accent-hover: #eb9600;
  --admin-bg: #070d18;
  --admin-surface: #111726;
  --admin-card: #161d2e;
  --admin-border: #1e2738;
  --admin-text: #f4f6f8;
  --admin-muted: #87919d;
  --admin-faint: #5d6673;
  background: var(--admin-bg);
  color: var(--admin-text);
  font-family: "Avenir Next", Avenir, "Helvetica Neue", Helvetica, Arial, sans-serif;}
/* Force the backend owner's wrapper to inherit our vars */
#ps-storefront .ps-private-surface:has(.dark) [class*="bg-[#070D18]"],
#ps-storefront .ps-private-surface:has(.dark) [class*="min-h-dvh"]{background: var(--admin-bg);
  color: var(--admin-text);}
/* Headings — ensure white text, our font */
#ps-storefront .ps-private-surface:has(.dark) h1,
#ps-storefront .ps-private-surface:has(.dark) h2,
#ps-storefront .ps-private-surface:has(.dark) h3{font-family: "Avenir Next", Avenir, "Helvetica Neue", Helvetica, Arial, sans-serif;
  letter-spacing: -0.03em;
  font-weight: 650;
  color: var(--admin-text);}
/* Body text */
#ps-storefront .ps-private-surface:has(.dark) p{color: var(--admin-muted);
  font-family: "Avenir Next", Avenir, "Helvetica Neue", Helvetica, Arial, sans-serif;
  line-height: 1.6;}
/* Links — orange accent */
#ps-storefront .ps-private-surface:has(.dark) a{color: var(--admin-accent);
  font-weight: 600;
  text-decoration: none;}
#ps-storefront .ps-private-surface:has(.dark) a:hover{color: var(--admin-accent-hover);}
/* Buttons — our font + radius */
#ps-storefront .ps-private-surface:has(.dark) button{font-family: "Avenir Next", Avenir, "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-weight: 700;
  border-radius: 10px;}
/* Cards — dark surface with subtle border */
#ps-storefront .ps-private-surface:has(.dark) [class*="rounded-xl"],
#ps-storefront .ps-private-surface:has(.dark) [class*="rounded-lg"]{background: var(--admin-card);
  border-color: var(--admin-border);
  box-shadow: none;}
/* Tables — dark theme */
#ps-storefront .ps-private-surface:has(.dark) table{width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 0.88rem;}
#ps-storefront .ps-private-surface:has(.dark) thead,
#ps-storefront .ps-private-surface:has(.dark) thead tr{background: var(--admin-surface);
  border-color: var(--admin-border);}
#ps-storefront .ps-private-surface:has(.dark) thead th{text-align: left;
  font-weight: 700;
  font-size: 0.72rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--admin-muted);
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--admin-border);
  background: var(--admin-surface);}
#ps-storefront .ps-private-surface:has(.dark) tbody td{padding: 0.85rem 1rem;
  border-bottom: 1px solid var(--admin-border);
  color: var(--admin-text);
  vertical-align: middle;}
#ps-storefront .ps-private-surface:has(.dark) tbody tr:last-child td{border-bottom: none;}
#ps-storefront .ps-private-surface:has(.dark) tbody tr:hover td{background: var(--admin-surface);}
/* Inputs — dark theme */
#ps-storefront .ps-private-surface:has(.dark) input,
#ps-storefront .ps-private-surface:has(.dark) select{background: var(--admin-surface);
  border: 1px solid var(--admin-border);
  color: var(--admin-text);
  border-radius: 8px;}
#ps-storefront .ps-private-surface:has(.dark) input::placeholder{color: var(--admin-faint);}
/* Metric card stat numbers — accent orange (not headings) */
#ps-storefront .ps-private-surface:has(.dark) [class*="text-xl"]:not(h1):not(h2):not(h3),
#ps-storefront .ps-private-surface:has(.dark) [class*="text-2xl"]:not(h1):not(h2):not(h3),
#ps-storefront .ps-private-surface:has(.dark) [class*="text-3xl"]:not(h1):not(h2):not(h3){color: var(--admin-accent);}
/* Borders — use our dark border color */
#ps-storefront .ps-private-surface:has(.dark) [class*="border-white\/10"],
#ps-storefront .ps-private-surface:has(.dark) [class*="border-white\/5"]{border-color: var(--admin-border);}
/* ═══════════════════════════════════════════════════════════════
   SELLER PORTAL — Escrow gate modal
   The seller portal is inside #ps-storefront but has no
   .ps-private-surface wrapper. Target the escrow modal classes
   directly to fix the low-contrast text and apply our brand.
   ═══════════════════════════════════════════════════════════════ */

/* Modal backdrop — keep dark overlay */
#ps-storefront .seller-mandatory-escrow-modal{background: rgba(0, 0, 0, 0.75);}
/* Dialog card — dark surface, not white */
#ps-storefront .seller-mandatory-escrow-modal__dialog{background: #0d1117;
  border: 1px solid #1e2738;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);}
/* Badge "ACTION REQUIRED" — orange pill */
#ps-storefront .seller-mandatory-escrow-modal__badge{background: rgba(255, 163, 0, 0.15);
  color: #ffa300;
  border: 1px solid rgba(255, 163, 0, 0.3);
  border-radius: 6px;
  padding: 4px 10px;
  letter-spacing: 0.08em;}
/* Headline — dark on white dialog (the backend owner forces dialog bg white with !important) */
#ps-storefront .seller-mandatory-escrow-modal__headline{color: #0f172a;
  font-weight: 700;}
/* Lead paragraph — dark gray on white */
#ps-storefront .seller-mandatory-escrow-modal__lead{color: #475569;
  line-height: 1.5;}
/* Comparison cards — both dark, readable */
#ps-storefront .seller-mandatory-escrow-modal__current{background: #161d2e;
  border: 1px solid #2a3548;
  border-radius: 12px;
  padding: 16px;}
/* Card headers — dark text override is aggressive, so use deep specificity */
#ps-storefront .seller-mandatory-escrow-modal .seller-mandatory-escrow-modal__dialog
  .seller-mandatory-escrow-modal__current h2[class*="text-white"]{color: #f4f6f8;
  font-weight: 600;}
#ps-storefront .seller-mandatory-escrow-modal .seller-mandatory-escrow-modal__dialog
  .seller-mandatory-escrow-modal__current ul[class*="text-white"] li{color: #b8c0cc;}
/* After-accept card — fix the invisible indigo text */
#ps-storefront .seller-mandatory-escrow-modal__after{background: #161d2e;
  border: 1px solid #ffa300;
  border-radius: 12px;
  padding: 16px;}
/* After-accept card — fix the invisible indigo text */
#ps-storefront .seller-mandatory-escrow-modal .seller-mandatory-escrow-modal__dialog
  .seller-mandatory-escrow-modal__after h2[class*="text-white"]{color: #ffa300;
  font-weight: 600;}
#ps-storefront .seller-mandatory-escrow-modal .seller-mandatory-escrow-modal__dialog
  .seller-mandatory-escrow-modal__after ul[class*="text-indigo"] li{color: #d0d8e4;}
/* Permanent warning — amber, readable */
#ps-storefront .seller-mandatory-escrow-modal__permanent{color: #f59e0b;
  font-weight: 600;}
/* Acceptance container — dark card with border */
#ps-storefront .seller-mandatory-escrow-modal__acceptance{background: #161d2e;
  border: 1px solid #2a3548;
  border-radius: 12px;
  padding: 16px;}
/* Checkbox label — readable */
#ps-storefront .seller-mandatory-escrow-modal__ack{color: #d0d8e4;}
/* Checkbox — orange accent, bigger */
#ps-storefront .seller-mandatory-escrow-modal__ack input[type="checkbox"]{width: 20px;
  height: 20px;
  accent-color: #ffa300;
  cursor: pointer;}
/* THE ACCEPT BUTTON — orange, bold, impossible to miss */
#ps-storefront .seller-mandatory-escrow-modal__confirm{background: #ffa300;
  color: #12161d;
  font-weight: 700;
  font-size: 16px;
  padding: 14px 24px;
  border-radius: 10px;
  opacity: 1;
  transition: transform 0.1s ease, box-shadow 0.2s ease;
  box-shadow: 0 0 0 2px #0d1117, 0 0 0 4px #ffa300;}
#ps-storefront .seller-mandatory-escrow-modal__confirm:hover:not(:disabled){background: #ffb520;
  transform: translateY(-1px);
  box-shadow: 0 0 0 2px #0d1117, 0 0 0 4px #ffb520, 0 4px 12px rgba(255, 163, 0, 0.3);}
#ps-storefront .seller-mandatory-escrow-modal__confirm:disabled{opacity: 0.4;
  cursor: not-allowed;}
/* Error text — red, visible */
#ps-storefront .seller-mandatory-escrow-modal__error{color: #ef4444;}
/* Footnote — readable */
#ps-storefront .seller-mandatory-escrow-modal__footnote{color: #87919d;}
/* Vendor monogram/avatar — dark bg + orange text */
#ps-storefront .ps-vendor-monogram,#ps-storefront .ps-vendor-profile-mark{display: grid; width: 3.35rem; height: 3.35rem; place-items: center; border-radius: 12px; background: #111419; color: #ffa300; font-size: 0.82rem; font-weight: 780; letter-spacing: -0.03em;}`
