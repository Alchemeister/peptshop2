# PeptShop Design System

> **Version 1.0** — Reference document for the PeptShop storefront CSS.
> Source of truth: PeptAura commit `afeebd6`. Current CSS has drifted in several
> places (documented in [§8 Divergence Notes](#8-divergence-notes)).
>
> **Files:**
> - `src/styles/tokens.css` — Design tokens, global resets, shared components
> - `src/styles/shell.css` — Site chrome (header, nav, footer, preview tools)
> - `src/styles/storefront.css` — All page layouts + "classic" homepage

---

## 1. Design Philosophy

PeptShop's visual language is **industrial, bold, solid, and modern** — it makes
a stand. The design draws from PeptAura's original aesthetic: confident
typography, a single amber accent against restrained neutrals, generous
whitespace, and purposeful motion.

### Two Rendering Modes

The site operates in **two distinct visual modes**, and this is the most
important thing to understand before touching CSS:

| Mode | Scope | Token system | Font | Canvas |
|------|-------|-------------|------|--------|
| **App shell** | Catalog, product detail, cart, checkout, vendors, COAs, content pages | `--ps-*` custom properties | Avenir Next | `--ps-canvas` (#f4f5f7 light) |
| **Classic homepage** | `/` route only | Hardcoded Tailwind-like hex values | Inter | `#ffffff` |

The app shell mode wraps everything in `.ps-app`, which defines the full
`--ps-*` token set on `:root`-equivalent scope. Dark mode is activated by
`[data-theme="dark"]` on the `.ps-app` element and overrides every token.

The classic homepage (`.ps-classic-home`) **opts out of the token system
entirely** — it uses hardcoded hex colors, Inter font, and its own component
classes prefixed `ps-classic-*`. This is intentional: the homepage is a
marketing surface with a different visual register than the transactional app.

### Token Discipline

- **Tokens define everything.** Colors, shadows, and fonts live in CSS custom
  properties on `.ps-app`.
- **Components reference tokens.** Never hardcode hex values in app-shell
  components — use `var(--ps-*)`.
- **Dark mode is free.** If you reference tokens, dark mode works automatically
  via the `[data-theme="dark"]` overrides.
- **Classic homepage is the exception.** It hardcodes colors by design. Do not
  retro fit it to tokens without a deliberate redesign.

### Accessibility Foundations

```css
/* Global resets (tokens.css) */
* { box-sizing: border-box; }
html { min-width: 320px; scroll-behavior: smooth; }
body { min-width: 320px; min-height: 100dvh; margin: 0; }
button, input, select, textarea { font: inherit; }
img, svg { display: block; }

/* Focus ring uses accent color */
.ps-app button, .ps-app a, .ps-app input, .ps-app select, .ps-app textarea {
  outline-color: var(--ps-accent);
  outline-offset: 3px;
}
```

A skip link (`.ps-skip-link`) is provided in shell.css, hidden off-screen until
focused. Reduced motion is respected globally:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 2. Color System

### App Shell Tokens (`--ps-*`)

All tokens are defined on `.ps-app` and overridden under
`.ps-app[data-theme="dark"]`.

#### Accent

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--ps-accent` | `#ffa300` | `#ffad24` | Primary accent, buttons, active states, focus rings |
| `--ps-accent-hover` | `#eb9600` | `#ffc25c` | Hover state for accent fills |
| `--ps-accent-soft` | `#fff4dc` | `#3b2c0a` | Tinted backgrounds for hover/active nav, soft highlights |

#### Neutrals

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--ps-canvas` | `#f4f5f7` | `#14171b` | Page background |
| `--ps-paper` | `#ffffff` | `#1b1f24` | Cards, modals, inputs, elevated surfaces |
| `--ps-surface` | `#eef1f4` | `#20252b` | Subtle backgrounds, image areas, format pills |
| `--ps-ink` | `#12161d` | `#f4f6f8` | Primary text |
| `--ps-muted` | `#5d6673` | `#b0bac5` | Secondary text, descriptions |
| `--ps-faint` | `#8993a0` | `#87919d` | Tertiary text, labels, index numbers |
| `--ps-deep` | `#111419` | `#090b0e` | Darkest neutral (footer, evidence band) |

#### Lines / Borders

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--ps-line` | `#dfe3e8` | `#30373f` | Standard borders, card edges, row dividers |
| `--ps-line-strong` | `#c7cdd5` | `#46505b` | Input borders, strong dividers, ledger top border |

#### Status Colors

Each status has a base color and a soft background variant.

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--ps-success` | `#167a53` | `#76d4ad` | Success messages, verification icons |
| `--ps-success-soft` | `#e8f7f0` | `#15382b` | Success backgrounds |
| `--ps-warning` | `#8b5a00` | `#ffc45b` | Warning text |
| `--ps-warning-soft` | `#fff4dc` | `#3a2c0f` | Warning backgrounds |
| `--ps-danger` | `#a43737` | `#ffb4ad` | Error states |
| `--ps-danger-soft` | `#fff0ef` | `#402020` | Error backgrounds |

#### Shadows

| Token | Value (light) | Usage |
|-------|---------------|-------|
| `--ps-shadow-soft` | `0 18px 50px rgba(45,55,68,0.08)` | Card hover lift, subtle elevation |
| `--ps-shadow-raised` | `0 26px 80px rgba(20,27,36,0.14)` | Modals, high-elevation surfaces |
| Dark `--ps-shadow-soft` | `0 18px 50px rgba(0,0,0,0.18)` | — |
| Dark `--ps-shadow-raised` | `0 26px 80px rgba(0,0,0,0.32)` | — |

#### Trust Label Variants (hardcoded)

Trust labels (`.ps-trust-label`) have variant classes with hardcoded colors
that don't use the token system:

| Variant | Light border | Light bg | Light text | Dark border | Dark bg | Dark text |
|---------|-------------|----------|------------|-------------|---------|-----------|
| `.ps-trust-trusted` | `#ead197` | `#fff7e5` | `#795000` | `#73571d` | `#33270d` | `#ffd67d` |
| `.ps-trust-verified` | `#b9d9ee` | `#ecf7ff` | `#17608c` | — | — | — |
| `.ps-trust-new` | `var(--ps-line)` | `var(--ps-surface)` | — | — | — | — |

#### Other Hardcoded Colors in App Shell

- Footer background: `#101318` (hardcoded, not a token)
- Status dot: `#38c486` with `box-shadow: 0 0 0 4px rgba(56,196,134,0.13)`
- Modal backdrop: `rgba(10,13,17,0.66)` with `backdrop-filter: blur(8px)`
- Primary action text: `#15181d` (always dark on amber, both themes)
- Preview tools: hardcoded dark UI (`#181c22`, `#f7f8fa`, etc.) — these are
  dev tools, not customer-facing

### Classic Homepage Colors (hardcoded)

The classic homepage uses a Tailwind-like palette. These are **not** tokens and
**not** theme-aware.

| Role | Hex | Usage |
|------|-----|-------|
| Text primary | `#0f172a` | Headings, body text, prices |
| Text muted | `#64748b` | Descriptions, secondary text |
| Text subtle | `#475569` | Tertiary text, links |
| Text faint | `#94a3b8` | Footer column headers, small labels |
| Border | `#e2e8f0` | Card borders, section dividers, footer borders |
| Border subtle | `#f1f5f9` | Inner dividers, product card top border |
| Alt background | `#f8fafc` | Trust bar, vendors section, footer bg |
| Accent | `#ffa300` | Primary buttons, icons, highlights |
| Accent hover | `#e09200` | Button hover, link hover |
| Accent soft | `#fff8ed` | Badge backgrounds, COA pills |
| Accent softer | `#ffefcf` | Trust item bg, step circle border, verified badge bg |
| Accent border | `#ffdc96` | Product card hover border, COA pill border |
| Info/verified | `#4338ca` / `#eef2ff` | Trusted vendor badge text/bg |
| Info soft | `#e0e7ff` | Trust item #3 icon bg |
| Success | `#10b981` | Available dot, USDT color |
| Success dark | `#047857` | Available text |
| Warning | `#f59e0b` | Proof icon, Bitcoin/Monero color |
| Warning dark | `#b87300` | Badge text on accent soft |
| Warning deeper | `#b45309` | Trust item #2 icon |
| Disclaimer bg | `#fffbeb` | Footer disclaimer box |
| Disclaimer border | `#fde68a` | Footer disclaimer border |
| Disclaimer text | `#92400e` | Footer disclaimer text |
| Hero gradient | `linear-gradient(135deg, #fff8ed 0%, #ffffff 50%, #eef2ff 100%)` | Classic hero bg |

---

## 3. Typography

### Font Families

```css
/* App shell — tokens.css :root and .ps-app */
font-family: "Avenir Next", Avenir, "Helvetica Neue", Helvetica, Arial, sans-serif;

/* Classic homepage — .ps-classic-home */
font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;

/* Mono (prices, ledger index, COA numbers) */
font-family: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace;

/* Ledger index fallback */
font-family: "SFMono-Regular", Consolas, monospace;
```

### Font Weight Scale

PeptShop uses an unusual **numeric weight scale** with intermediate values
(550, 650, 720, 750, 780) rather than standard 400/500/600/700. This is a
PeptAura signature — the intermediate weights create a tighter visual hierarchy.

| Weight | Usage |
|--------|-------|
| 400 | Evidence sheet h1 (Georgia serif) |
| 500 | Form input text, body text in classic mode |
| 550 | Check rows, subtle labels, proof text, secondary links |
| 600 | Small labels, format pill text |
| 610 | Hero h1 (classic), evidence band h2 |
| 620 | Section intro h2, footer lead h2, proof row |
| 650 | Section heading links, secondary buttons, text links, masthead h1 |
| 670 | Ledger name emphasis |
| 680 | Ledger format/market/price strong, toast, footer column links |
| 700 | Overline, badges, strong emphasis, classic section headings |
| 720 | Form labels, product card small labels |
| 750 | Nav links, buttons, card titles, trust labels, headings, vendor names |
| 780 | Hero search button |
| 800 | Cart badge only |

### Font Size Scale

The scale ranges from tiny badges to massive masthead headlines, using `rem`
for most UI and `clamp()` for responsive display sizes.

| Size | Usage |
|------|-------|
| `0.55rem` | Preview tool nav button labels |
| `0.58rem` | Preview tool code |
| `0.6rem` | Cart badge |
| `0.62rem` | Format pills, featured market copy small, badge text, evidence sheet small |
| `0.65rem` | Ledger index, ledger labels, footer bottom, preview theme button |
| `0.66rem` | Preview theme buttons |
| `0.67rem` | Kicker, footer column h3 |
| `0.68rem` | Home overline, preview tool header strong |
| `0.69rem` | Kicker, footer bottom, status pill |
| `0.7rem` | Proof row |
| `0.72rem` | Ticker span, evidence sheet head |
| `0.74rem` | Preview tools toggle, toast |
| `0.76rem` | Ledger format strong, featured card CTA, form note |
| `0.77rem` | Evidence sheet method |
| `0.78rem` | Form labels, product card format pill, back link |
| `0.79rem` | Footer column links |
| `0.82rem` | Back link, empty state button, check row |
| `0.84rem` | Footer brand paragraph |
| `0.86rem` | Button text (primary/outline/dark-link) |
| `0.87rem` | Evidence sheet copy |
| `0.88rem` | Nav links, ledger category label |
| `0.9rem` | Search input, form inputs |
| `0.91rem` | Hero search input |
| `0.94rem` | Section intro paragraph |
| `0.96rem` | Evidence band copy |
| `1rem` | Ledger name, form input base, product card h3 |
| `1.08rem` | Brand text |
| `1.125rem` | Classic product card h3, classic how h3 |
| `1.15rem` | Featured market copy price |
| `1.2rem` | Evidence sheet h3 |
| `1.25rem` | Classic product price strong, classic hero card h2 |
| `1.5rem` | Ticker strong, classic section heading h2 |
| `1.6rem` | Empty state h2 |
| `1.875rem` | Classic hero price strong |
| `clamp(2rem, 4vw, 3.4rem)` | Featured market card h2 |
| `clamp(2.4rem, 5.7vw, 5.4rem)` | Footer lead h2 |
| `clamp(2.5rem, 5.4vw, 5.1rem)` | Section intro h2 |
| `clamp(2.7rem, 6vw, 5.8rem)` | Evidence band h2 |
| `clamp(3rem, 7vw, 6.5rem)` | Page masthead h1 |
| `clamp(3.4rem, 7vw, 6.5rem)` | Evidence sheet h1 (Georgia serif) |
| `clamp(3.8rem, 8.8vw, 8.4rem)` | Home hero h1 (dark hero) |

### Letter Spacing

PeptShop uses aggressive negative tracking on large headings and positive
tracking on uppercase labels. This is core to the PeptAura aesthetic.

| Value | Usage |
|-------|-------|
| `-0.07em` | Home hero h1, evidence sheet h1 |
| `-0.065em` | Page masthead h1, evidence band h2 |
| `-0.06em` | Section intro h2, footer lead h2 |
| `-0.055em` | Featured market card h2 |
| `-0.04em` | Ticker strong, modal success h2 |
| `-0.035em` | Brand logo, empty state h2 |
| `-0.03em` | Evidence sheet h3 |
| `-0.025em` | Classic section heading h2 |
| `-0.02em` | Product card h3, ledger name, classic hero card h2 |
| `-0.01em` | Nav links |
| `0.02em` | Format pills |
| `0.05em` | Uppercase labels (product meta, vendor badges, dose COA pill) |
| `0.06em` | Footer column h2 (classic), disclaimer strong, empty card small |
| `0.08em` | Featured market head |
| `0.1em` | Home overline |
| `0.11em` | Footer column h3 (app shell) |
| `0.13em` | Kicker |

### Line Height

- `0.86` — Home hero h1 (extremely tight for display)
- `0.93` — Page masthead h1
- `0.96` — Footer lead h2
- `0.98` — Section intro h2
- `1.3` — Kicker
- `1.45` — Check row, vendor description, how-it-works p
- `1.5` — Empty card p, how-it-works p
- `1.6` — Footer brand p, modal success p, disclaimer p
- `1.625` — Classic hero intro, footer brand p, disclaimer p
- `1.65` — Hero copy p, footer brand p
- `1.7` — Page masthead p, section intro p
- `1.75` — Evidence band copy p

---

## 4. Spacing & Layout

### Max Widths

| Context | Width | Class |
|---------|-------|-------|
| App shell sections | `80rem` (1280px) | `.ps-section-shell` |
| App shell header/footer | `80rem` | `.ps-header-inner`, `.ps-footer-*` |
| Classic homepage container | `72rem` (1152px) | `.ps-classic-container` |
| Classic footer container | `72rem` | `.ps-classic-footer-container` |
| Modal | `29rem` (464px) | `.ps-modal` |

### Horizontal Padding

```css
/* App shell — responsive horizontal padding */
padding-inline: clamp(1rem, 3vw, 2.5rem);

/* Classic homepage — fixed */
padding-inline: 2rem;  /* .ps-classic-container */
padding-inline: 1rem;  /* @media (max-width: 640px) */
```

### Section Block Spacing

| Context | Value | Class |
|---------|-------|-------|
| Page masthead | `clamp(3.5rem, 8vw, 7rem)` top, `clamp(2rem, 4vw, 3.5rem)` bottom | `.ps-page-masthead` |
| Home products section | `clamp(5rem, 10vw, 9rem)` block | `.ps-home-products` |
| Classic section | `5rem` block | `.ps-classic-section` |
| Classic how-it-works | `6rem` block | `.ps-classic-how` |
| Footer top margin | `clamp(5rem, 10vw, 10rem)` | `.ps-footer` |
| Footer lead | `clamp(3.5rem, 7vw, 6.5rem)` block | `.ps-footer-lead` |
| Footer grid | `3.5rem` block | `.ps-footer-grid` |
| Footer bottom | `1.3rem 5rem` block | `.ps-footer-bottom` |
| Classic hero | `5rem` block | `.ps-classic-hero` |
| Classic footer | `3.5rem 2rem 0` | `.ps-classic-footer-container` |

### Grid Patterns

| Pattern | Columns | Classes |
|---------|---------|---------|
| Product grid (classic) | `repeat(3, minmax(0, 1fr))` | `.ps-classic-product-grid` |
| Vendor grid (classic) | `repeat(3, minmax(0, 1fr))` | `.ps-classic-vendor-grid` |
| Trust grid (classic) | `repeat(4, minmax(0, 1fr))` | `.ps-classic-trust-grid` |
| Hero grid (classic) | `minmax(0, 1.12fr) minmax(20rem, 0.88fr)` | `.ps-classic-hero-grid` |
| How-it-works (classic) | `repeat(3, minmax(0, 1fr))` | `.ps-classic-how ol` |
| Footer grid (classic) | `repeat(4, minmax(0, 1fr))` | `.ps-classic-footer-grid` |
| Ticker | `repeat(4, minmax(0, 1fr))` | `.ps-home-ticker` |
| Home hero (dark) | `minmax(0, 1.2fr) minmax(21rem, 0.8fr)` | `.ps-home-hero` |
| Evidence band | `minmax(0, 1fr) minmax(22rem, 0.72fr)` | `.ps-evidence-band` |
| Section intro | `minmax(0, 1fr) minmax(18rem, 0.55fr)` | `.ps-section-intro` |
| Page title row | `minmax(0, 1.35fr) minmax(18rem, 0.65fr)` | `.ps-page-title-row` |
| Product ledger row | `2rem 4.3rem minmax(10rem,1.3fr) minmax(8rem,0.8fr) minmax(7rem,0.65fr) minmax(7rem,0.65fr) auto` | `.ps-product-ledger-row` |
| Footer grid (app shell) | `minmax(16rem, 1.5fr) repeat(3, minmax(9rem, 0.5fr))` | `.ps-footer-grid` |
| Form grid | `repeat(2, minmax(0, 1fr))` | `.ps-form-grid` |
| Header | `minmax(10rem, 0.8fr) minmax(14rem, 0.6fr) auto minmax(4rem, 0.35fr)` | `.ps-header-inner` |
| Vendor card dl | `repeat(2, minmax(0, 1fr))` | `.ps-classic-vendor-card dl` |

### Border Radius Scale

| Radius | Usage |
|--------|-------|
| `3px` | Evidence sheet (intentionally sharp, paper-like) |
| `0.25rem` (4px) | Classic badges, product meta span, vendor head small, dose pills |
| `5px` | Format pills (app shell) |
| `6px` | Small buttons, classic dose list span |
| `7px` | Category chips |
| `8px` | Nav links, icon buttons, preview tool buttons, filter chips |
| `9px` | Hero search button, modal close, sort dropdown, preview nav buttons |
| `10px` | Form inputs, primary/outline/dark-link buttons, preview current, toast |
| `0.75rem` (12px) | Classic product/vendor cards, classic buttons, hero search, cart groups |
| `14px` | Summary card, preview tools panel |
| `16px` | Modal, empty state, featured market card, hero card (classic) |
| `999px` | Pills, dots, trust labels, status indicators, circles |

### Gap Scale

| Gap | Usage |
|-----|-------|
| `0.2rem` | Preview current grid |
| `0.25rem` | Desktop nav, product price baseline, badge tight |
| `0.35rem` | Preview theme, preview nav, trust label icon |
| `0.375rem` | Classic dose list |
| `0.4rem` | Live indicator |
| `0.45rem` | Kicker, back link, skip link, form note, footer column |
| `0.5rem` | Header actions, classic product price, preview payment row |
| `0.55rem` | Brand, header search, button row |
| `0.625rem` | Classic footer column ul, classic dose list |
| `0.65rem` | Check row, footer column |
| `0.7rem` | Hero search |
| `0.75rem` | Button row, hero vendors, classic trust item, vendor head |
| `0.875rem` | Classic disclaimer, hero card head |
| `1rem` | Form grid, section heading, footer bottom, classic hero actions, vendor dl |
| `1.2rem` | Header inner (current) |
| `1.25rem` | Masthead split, classic hero card link, empty state p, how-it-works li margin |
| `1.5rem` | Classic product/vendor grid, classic hero card padding, how-it-works step margin |
| `2rem` | Classic container padding, classic trust grid, classic section heading, footer lead, hero grid (900px) |
| `2.5rem` | Classic footer grid, classic disclaimer margin, classic payment row margin |
| `3rem` | Product ledger margin-top, classic how-it-works gap (900px hero) |
| `4rem` | Classic hero grid gap |
| `clamp(2rem, 5vw, 5rem)` | Footer grid (app shell) |
| `clamp(2rem, 7vw, 7rem)` | Section intro, page title row |
| `clamp(2rem, 6vw, 6rem)` | Home hero gap |
| `clamp(3rem, 8vw, 8rem)` | Evidence band gap |

---

## 5. Components

### Header (shell.css)

```css
.ps-site-header {
  position: sticky;
  top: 0;
  z-index: 50;
  border-bottom: 1px solid color-mix(in srgb, var(--ps-line) 84%, transparent);
  background: color-mix(in srgb, var(--ps-paper) 88%, transparent);
  backdrop-filter: blur(18px) saturate(1.2);
}
```

- **Layout:** CSS grid, 4 columns: logo | search | nav | cart
- **Min-height:** `4.7rem`
- **Backdrop:** 88% paper opacity + 18px blur + saturation boost
- **Home variant:** `.ps-site-header-home` — absolute, transparent, white text,
  no backdrop blur. Currently `display: none` (homepage has no global header;
  brand lives in the hero).

#### Brand Logo

```css
.ps-brand img {
  width: 10rem;     /* ⚠️ Drifted from original 7.9rem — see §8 */
  height: 2.5rem;   /* ⚠️ Drifted from original 2.35rem */
  object-fit: contain;
  object-position: left center;
}
```

Inverse variant (on dark backgrounds): `filter: brightness(0) invert(1)`.

#### Search

Borderless input with bottom border, `0.9rem` font size. No background, no
border-radius — just a subtle underline.

#### Desktop Nav

```css
.ps-desktop-nav a {
  border-radius: 8px;
  padding: 0.7rem 1rem;
  color: var(--ps-muted);
  font-size: 0.88rem;
  font-weight: 750;
  letter-spacing: -0.01em;
  transition: background 0.12s, color 0.12s;
}
.ps-desktop-nav a:hover,
.ps-desktop-nav a[aria-current="page"] {
  background: var(--ps-accent-soft);
  color: var(--ps-ink);
}
```

On the home header variant, nav links use `rgba(255,255,255,0.78)` text and
`rgba(255,255,255,0.1)` hover background.

#### Cart Button

Icon button (`.ps-icon-button`) with a badge span:
- Position: `top: -0.35rem; right: -0.35rem`
- Size: `min-width: 1.25rem; height: 1.25rem`
- `border-radius: 999px; background: var(--ps-accent); color: #15181d`
- Font: `0.6rem / 800` weight

### Buttons (tokens.css)

Four button variants, all sharing a base:

```css
.ps-primary-action, .ps-outline-action, .ps-dark-link, .ps-text-link {
  display: inline-flex;
  min-height: 2.85rem;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  border-radius: 10px;
  padding: 0.75rem 1rem;
  font-size: 0.86rem;
  font-weight: 750;
  transition: transform 150ms ease, border-color 150ms ease, background 150ms ease;
}
```

| Variant | Border | Background | Text | Hover |
|---------|--------|------------|------|-------|
| `.ps-primary-action` | `1px solid var(--ps-accent)` | `var(--ps-accent)` | `#15181d` (always dark) | `--ps-accent-hover` border+bg |
| `.ps-outline-action` | `1px solid var(--ps-line-strong)` | `var(--ps-paper)` | `var(--ps-ink)` | accent border + accent-soft bg |
| `.ps-dark-link` | `1px solid rgba(255,255,255,0.28)` | transparent | `#ffffff` | — |
| `.ps-text-link` | none | none | inherit | — |

All variants: `:active { transform: translateY(1px) }` for tactile press.

### Classic Homepage Buttons

Different sizing and radius from app shell buttons:

```css
.ps-classic-button-primary, .ps-classic-button-secondary {
  min-height: 3.25rem;
  border-radius: 0.75rem;  /* 12px, larger than app shell's 10px */
  padding: 0.875rem 1.5rem;
  font-size: 1rem;
  font-weight: 650;
}
```

Primary: `#ffa300` fill, `#ffffff` text (note: white text, vs app shell's dark
`#15181d` text on accent). Hover: `#e09200`. Active: `scale(0.98)`.

Secondary: `#cbd5e1` border, `#ffffff` bg, `#334155` text. Hover: `#94a8b` border,
`#f8fafc` bg.

### Product Cards (Classic)

```css
.ps-classic-product-card {
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  background: #ffffff;
  padding: 1.5rem;
  transition: border-color 200ms ease, box-shadow 200ms ease, transform 200ms ease;
}
.ps-classic-product-card:hover {
  border-color: #ffdc96;      /* amber border on hover */
  box-shadow: 0 10px 25px -8px rgb(15 23 42 / 0.15);
  transform: translateY(-2px); /* subtle lift */
}
```

Card anatomy:
- **Image area:** `8rem` height, centered contain
- **Meta row:** format pill (accent soft bg, uppercase, 0.05em tracking) +
  availability dot (green `#10b981` or gray `#cbd5e1`)
- **Title:** `1.125rem / 750 / -0.02em`
- **Dose list:** flex-wrap pills, `0.375rem` gap, `.is-coa` variant uses amber
- **Price row:** top border `#f1f5f9`, JetBrains Mono strong price, arrow icon
  that translates right on hover

### Vendor Cards (Classic)

```css
.ps-classic-vendor-card {
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  background: #ffffff;
  padding: 1.5rem;
  transition: border-color 200ms ease, box-shadow 200ms ease, transform 200ms ease;
}
```

Card anatomy:
- **Vendor mark:** `2.5rem` square, `0.5rem` radius,
  `background: linear-gradient(135deg, #ffa300, #e09200)`, white initials
- **Head:** mark + name + trust badge (`.is-trusted` = indigo, `.is-verified` =
  amber)
- **Description:** 2-line clamp (`-webkit-line-clamp: 2`)
- **Stats grid:** `<dl>` with `repeat(2, 1fr)`, dt labels uppercase `0.625rem`,
  dd values `0.875rem / 750` with amber svg icons

### Hero Card (Classic)

```css
.ps-classic-hero-card {
  border: 1px solid #f1f5f9;
  border-radius: 1rem;          /* 16px */
  background: #ffffff;
  padding: 1.5rem;
  box-shadow: 0 20px 50px -12px rgb(0 0 0 / 0.1);
  animation: ps-classic-card-sway 12s ease-in-out infinite;
}
.ps-classic-hero-card:hover {
  box-shadow: 0 24px 55px -16px rgb(15 23 42 / 0.22);
  animation-play-state: paused;  /* freeze sway on hover */
}
```

Card anatomy:
- **Head:** accent-soft badge (`#fff8ed` bg, `#b87300` text, uppercase) + small
  label
- **Title:** `1.25rem / 750 / -0.02em`
- **Price:** JetBrains Mono `1.875rem` strong + muted span
- **Vendor rows:** border `#f1f5f9`, `0.5rem` radius, `.is-primary` uses
  `#ffefcf` border + `rgb(255 248 237 / 0.55)` bg, amber dot
- **CTA link:** top border, centered, `#e09200` text
- **Blob:** `24rem` circle, `rgb(255 200 100 / 0.35)`, `blur(60px)`,
  `ps-classic-float 10s` animation (behind card, z-index: -1)

### Trust Bar (Classic)

```css
.ps-classic-trust-bar {
  border-block: 1px solid #e2e8f0;
  background: #f8fafc;
}
.ps-classic-trust-grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 2rem;
  padding-block: 2.5rem;
}
```

Each trust item has a colored icon circle (`2.5rem`, `999px` radius):
1. `#ffefcf` bg / `#b87300` color (amber)
2. `#fef3c7` bg / `#b45309` color (darker amber)
3. `#e0e7ff` bg / `#4338ca` color (indigo)
4. `#e2e8f0` bg / `#334155` color (slate)

### Footer (App Shell)

```css
.ps-footer {
  margin-top: clamp(5rem, 10vw, 10rem);
  background: #101318;  /* hardcoded, near-black */
  color: #ffffff;
}
```

- **Lead:** 2-col grid (heading + link), `clamp(3.5rem, 7vw, 6.5rem)` block
  padding, `clamp(2.4rem, 5.7vw, 5.4rem)` h2 with `-0.06em` tracking
- **Grid:** `minmax(16rem, 1.5fr) repeat(3, minmax(9rem, 0.5fr))`, brand column
  + 3 link columns. Column headers: `0.67rem / 750 / 0.11em / uppercase`
- **Links:** `rgba(255,255,255,0.72)` text, hover → `var(--ps-accent)`
- **Bottom:** flex space-between, `0.69rem` text, `rgba(255,255,255,0.4)` color

### Footer (Classic)

```css
.ps-classic-footer {
  margin-top: 5rem;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
  color: #0f172a;
  font-family: Inter, system-ui, ...;
}
```

- 4-col grid, `2.5rem` gap
- Column headers: `0.75rem / 650 / 0.06em / uppercase / #94a3b8`
- Links: `#475569`, hover `#e09200`
- Payment badges: border `#e2e8f0`, `0.375rem` radius, `#334155` text, with
  crypto-specific colors (Bitcoin `#f59e0b`, Ethereum `#6366f1`, USDC `#2775ca`,
  USDT `#10b981`)
- Disclaimer box: `#fffbeb` bg, `#fde68a` border, `0.75rem` radius, `#92400e`
  text

### Forms (tokens.css)

```css
.ps-form-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}
.ps-form-grid label {
  font-size: 0.78rem;
  font-weight: 720;
  flex-direction: column;
  gap: 0.48rem;
}
.ps-form-grid input, .ps-form-grid select, .ps-form-grid textarea {
  min-height: 3rem;
  border: 1px solid var(--ps-line-strong);
  border-radius: 10px;
  background: var(--ps-paper);
  padding: 0.75rem 0.85rem;
  font-size: 0.9rem;
  font-weight: 500;
}
/* Focus state */
input:focus {
  border-color: var(--ps-accent);
  outline: 3px solid color-mix(in srgb, var(--ps-accent) 22%, transparent);
}
```

- `.ps-field-wide` spans full grid (`grid-column: 1 / -1`)
- Textareas: `min-height: 8rem; resize: vertical`
- Check rows: flex row, `accent-color: var(--ps-accent)`

### Modals (tokens.css)

```css
.ps-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  place-items: center;
  background: rgba(10, 13, 17, 0.66);
  backdrop-filter: blur(8px);
}
.ps-modal {
  width: min(100%, 29rem);
  border: 1px solid var(--ps-line);
  border-radius: 16px;
  background: var(--ps-paper);
  padding: 1.7rem;
  box-shadow: var(--ps-shadow-raised);
}
```

- Close button: `2.25rem` square, `9px` radius, positioned `top: 0.9rem; right:
  0.9rem`
- Success variants: centered column, success-colored svg, `-0.04em` tracking h2

### Empty States (tokens.css)

```css
.ps-empty-state {
  min-height: 24rem;
  border: 1px dashed var(--ps-line-strong);  /* dashed border */
  border-radius: 16px;
  background: var(--ps-paper);
  padding: 2rem;
  text-align: center;
  display: grid;
  place-items: center;
}
```

- Icon: `var(--ps-accent)` color
- h2: `1.6rem / -0.035em`
- Button: border `1px solid var(--ps-line-strong)`, `10px` radius, `0.82rem /
  700`

### Trust Labels (tokens.css)

```css
.ps-trust-label {
  display: inline-flex;
  border: 1px solid var(--ps-line);
  border-radius: 999px;
  background: var(--ps-paper);
  padding: 0.3rem 0.55rem;
  color: var(--ps-muted);
  font-size: 0.68rem;
  font-weight: 750;
  text-transform: capitalize;
}
```

Variants: `.ps-trust-trusted` (amber), `.ps-trust-verified` (blue),
`.ps-trust-new` (neutral surface). See [§2](#trust-label-variants-hardcoded)
for exact colors.

### Kicker (tokens.css)

A small uppercase label with a dot prefix, used above section headings:

```css
.ps-kicker {
  font-size: 0.69rem;
  font-weight: 750;
  letter-spacing: 0.13em;
  text-transform: uppercase;
  color: var(--ps-muted);
}
.ps-kicker::before {
  width: 0.45rem;
  height: 0.45rem;
  border-radius: 50%;
  background: var(--ps-accent);
  content: '';
}
```

### Product Ledger (storefront.css)

A table-like row layout for the homepage product list:

```css
.ps-product-ledger-row {
  min-height: 7rem;
  grid-template-columns:
    2rem    /* index */
    4.3rem  /* image */
    minmax(10rem, 1.3fr)  /* name */
    minmax(8rem, 0.8fr)   /* formats */
    minmax(7rem, 0.65fr)  /* market */
    minmax(7rem, 0.65fr)  /* price */
    auto;   /* arrow */
  border-bottom: 1px solid var(--ps-line);
  transition: background 160ms ease, padding 160ms ease;
}
.ps-product-ledger-row:hover {
  background: var(--ps-paper);
  padding-inline: 0.8rem;  /* slide in slightly */
}
```

Index uses mono font. Arrow translates right and turns amber on hover.

### Preview Tools (shell.css)

A floating dev panel for previewing pages and themes. Fixed bottom-right,
z-index 150. Uses hardcoded dark colors (not tokens) since it's a dev tool:

- Toggle: `#181c22` bg, `11px` radius, white text
- Panel: `#f7f8fa` bg, `14px` radius, `25rem` max width
- Theme buttons: amber active state (`#ffa300` border, `#fff4dc` bg)
- Page nav: 2-col grid, `4.5rem` min-height cards with uppercase labels

### Toast (shell.css)

```css
.ps-preview-toast {
  position: fixed;
  left: 50%;
  bottom: 1.1rem;
  z-index: 180;
  transform: translateX(-50%);
  border: 1px solid #39414b;
  border-radius: 10px;
  background: #171b20;
  padding: 0.72rem 0.9rem;
  color: #ffffff;
  font-size: 0.74rem;
  font-weight: 680;
  animation: ps-toast-in 180ms ease-out;
}
```

---

## 6. Animations

### Keyframes

```css
/* Entrance — used by classic hero elements with staggered delays */
@keyframes ps-classic-fade-up {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
/* Usage: animation: ps-classic-fade-up 500ms ease-out [delay] both; */
/* Delays: 0ms (logo), 100ms (intro), 200ms (actions, links), 300ms (proof) */

/* Hero card gentle sway — ⚠️ Drifted, see §8 */
@keyframes ps-classic-card-sway {
  0%, 100% { transform: rotate(0deg) translateY(0); }
  50%      { transform: rotate(0.8deg) translateY(-2px); }
}
/* Current: 12s ease-in-out infinite */
/* Original: 6s, rotate(2deg) translateY(-4px) — more movement, faster */

/* Floating blob — ⚠️ Drifted, see §8 */
@keyframes ps-classic-float {
  0%, 100% { transform: translate(-50%, -50%); }
  50%      { transform: translate(-50%, calc(-50% - 8px)); }
}
/* Current: 10s ease-in-out infinite */
/* Original: 6s */

/* Toast entrance */
@keyframes ps-toast-in {
  from { opacity: 0; transform: translate(-50%, 0.5rem); }
  to   { opacity: 1; transform: translate(-50%, 0); }
}
/* Duration: 180ms ease-out */
```

### Transitions

Standard hover transitions are **120–200ms ease**:

| Duration | Properties | Usage |
|----------|-----------|-------|
| `120ms` | `background, color` | Nav links |
| `150ms` | `transform, border-color, background` | Buttons (primary, outline, dark-link, text) |
| `160ms` | `background, padding` | Product ledger rows |
| `160ms` | `color` | Classic footer links, secondary links |
| `180ms` | `background-color, border-color, color, transform, box-shadow` | Classic buttons |
| `180ms` | `transform` | Product card arrow, hero button svg |
| `200ms` | `border-color, box-shadow, transform` | Classic product/vendor cards |
| `260ms` | `transform, border-color` | Featured market card (dark hero) |
| `300ms` | `box-shadow` | Classic hero card |

### Reduced Motion

All animations and transitions are reduced to `0.01ms` under
`prefers-reduced-motion: reduce`. Smooth scroll is also disabled. This is a
global rule in tokens.css.

---

## 7. Responsive Breakpoints

PeptShop has **two breakpoints**: 900px and 640px. There is no tablet-specific
or large-desktop breakpoint.

### 900px breakpoint

| Element | Desktop | ≤ 900px |
|---------|---------|---------|
| Classic hero grid | 2-col (`1.12fr 0.88fr`) | 1-col, `3rem` gap, centered text |
| Classic hero card | `justify-self: end` | `justify-self: center` |
| Classic trust grid | 4-col | 2-col, centered items |
| Classic product/vendor grid | 3-col | 2-col, last item centered at 50% width |
| Classic footer grid | 4-col | 2-col |
| Desktop nav | visible | hidden (mobile menu shows) |

### 640px breakpoint

| Element | > 640px | ≤ 640px |
|---------|---------|---------|
| Classic container padding | `2rem` | `1rem` |
| Classic hero padding | `5rem` block | `4.5rem` block |
| Classic hero logo | `7.5rem` height | `5rem` height |
| Classic hero intro | `1.125rem` | `1rem` |
| Classic hero actions | flex row | flex column, full width |
| Classic buttons | auto width | `width: 100%` |
| Classic hero proof | flex-wrap row | `justify-content: center` |
| Classic footer grid | 2-col (from 900px) | 1-col |
| Classic payment row | flex row | flex column |

### App Shell Responsive

The app shell header hides the desktop nav and shows a mobile menu button at
900px (`.ps-mobile-menu-button { display: none }` → shown in media query). The
mobile nav (`.ps-mobile-nav`) slides in as a dropdown panel.

---

## 8. Divergence Notes

The following items document where the current CSS has **drifted from the
original PeptAura design** (commit `afeebd6`). The original values are the
intended design language; current values should be realigned where noted.

### Header Grid

| | Original (PeptAura) | Current | Impact |
|---|---|---|---|
| Grid template | `minmax(9rem,1fr) minmax(13rem,0.7fr) auto minmax(4rem,0.35fr)` | `minmax(10rem,0.8fr) minmax(14rem,0.6fr) auto minmax(4rem,0.35fr)` | Logo and search columns are wider |
| Gap | `1.4rem` | `1.2rem` | Tighter spacing |

**Recommendation:** Revert to original grid template and gap for PeptAura's
tighter, more balanced header.

### Brand Logo

| | Original | Current | Impact |
|---|---|---|---|
| Size | `7.9rem × 2.35rem` | `10rem × 2.5rem` | Oversized logo dominates header |

**Recommendation:** Revert to `7.9rem × 2.35rem`.

### Search Input

| | Original | Current | Impact |
|---|---|---|---|
| Font size | `0.82rem` | `0.9rem` | Slightly larger, less refined |

**Recommendation:** Revert to `0.82rem`.

### Nav Links

| | Original | Current | Impact |
|---|---|---|---|
| Font size | `0.78rem` | `0.88rem` | Bolder, heavier |
| Font weight | `700` | `750` | — |
| Padding | `0.65rem 0.78rem` | `0.7rem 1rem` | Larger hit area but bulkier |
| Letter spacing | none | `-0.01em` | Subtle, adds to heaviness |
| Transition | none | `background 0.12s, color 0.12s` | Added (improvement, keep) |

**Recommendation:** Revert font size to `0.78rem`, weight to `700`, padding to
`0.65rem 0.78rem`. The transition is a good addition and should stay.

### Hero Padding (Classic)

| | Original | Current | Impact |
|---|---|---|---|
| Block padding | `7rem` | `5rem` | Less breathing room, feels compressed |

**Recommendation:** Revert to `7rem` block padding.

### Hero Logo (Classic)

| | Original | Current | Impact |
|---|---|---|---|
| Height | `6rem` | `7.5rem` | Oversized |

**Recommendation:** Revert to `6rem` height.

### Hero Card Sway Animation

| | Original | Current | Impact |
|---|---|---|---|
| Duration | `6s` | `12s` | Half the speed — barely perceptible |
| Transform | `rotate(2deg) translateY(-4px)` | `rotate(0.8deg) translateY(-2px)` | Minimal movement |

**Recommendation:** Revert to `6s` duration and `rotate(2deg) translateY(-4px)`
for the intended gentle-but-noticeable sway.

### Hero Blob

| | Original | Current | Impact |
|---|---|---|---|
| Size | `18rem` | `24rem` | Larger, more diffuse |
| Blur | `48px` | `60px` | Softer, less defined |
| Color | `rgb(255 220 150 / 0.4)` | `rgb(255 200 100 / 0.35)` | Less saturated, less warm |
| Float duration | `6s` | `10s` | Slower, less lively |

**Recommendation:** Revert to `18rem`, `blur(48px)`, `rgb(255 220 150 / 0.4)`,
`6s` for a warmer, more energetic ambient effect.

### Category Label

| | Original | Current | Impact |
|---|---|---|---|
| Text transform | `uppercase` | removed | Loses the industrial label aesthetic |

**Recommendation:** Restore `text-transform: uppercase` on category labels.

### New Additions (Not in PeptAura Original)

The following CSS sections are **new additions** in PeptShop that did not exist
in PeptAura. They should follow the token system and match the existing design
language:

- **Region dropdown** — Should use `--ps-*` tokens for borders, backgrounds,
  and focus states
- **COA items** (product page COA section) — Should use `--ps-paper` bg,
  `--ps-line` borders, `--ps-shadow-soft` for elevation
- **Cart vendor grouping** — Group headers should use `--ps-muted` labels,
  `--ps-line` dividers, `12px` radius per group
- **Offer grid** — Should follow the product card pattern: `--ps-line` border,
  hover lift with `--ps-shadow-soft`, amber hover border
- **Product page COA section** — Should use `--ps-paper` bg, `--ps-line`
  borders, `--ps-accent` for verification icons

**General rule for new components:** If it's in the app shell (inside `.ps-app`),
it must use `--ps-*` tokens. No hardcoded hex values. If it needs a color that
doesn't exist in the token system, add a new token to `.ps-app` and its dark
override rather than hardcoding.

---

## Quick Reference: Token Cheat Sheet

```css
/* Colors */
--ps-accent: #ffa300;
--ps-accent-hover: #eb9600;
--ps-accent-soft: #fff4dc;
--ps-canvas: #f4f5f7;
--ps-paper: #ffffff;
--ps-surface: #eef1f4;
--ps-ink: #12161d;
--ps-muted: #5d6673;
--ps-faint: #8993a0;
--ps-line: #dfe3e8;
--ps-line-strong: #c7cdd5;
--ps-success: #167a53;
--ps-success-soft: #e8f7f0;
--ps-warning: #8b5a00;
--ps-warning-soft: #fff4dc;
--ps-danger: #a43737;
--ps-danger-soft: #fff0ef;
--ps-deep: #111419;

/* Shadows */
--ps-shadow-soft: 0 18px 50px rgba(45, 55, 68, 0.08);
--ps-shadow-raised: 0 26px 80px rgba(20, 27, 36, 0.14);

/* Fonts */
/* App shell:    "Avenir Next", Avenir, "Helvetica Neue", Helvetica, Arial, sans-serif */
/* Classic:      Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif */
/* Mono:         "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace */

/* Key sizes */
/* Max width:    80rem (app shell), 72rem (classic) */
/* H padding:    clamp(1rem, 3vw, 2.5rem) */
/* Masthead:     clamp(3.5rem, 8vw, 7rem) top */
/* Footer mt:    clamp(5rem, 10vw, 10rem) */

/* Breakpoints:  900px, 640px */
```