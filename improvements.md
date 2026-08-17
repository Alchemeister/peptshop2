# PeptShop Improvements

## Social Embeds (X/Twitter, Discord, etc.)

**Problem:** When peptshop.io is shared, the embed shows a tiny gray placeholder card instead of a rich preview. PeptAura shows a full homepage preview.

**Root cause:** 0x's Next.js backend `layout.tsx` meta tags override the Vite app's `index.html` tags.

| Tag | 0x's live site (wrong) | Our index.html (correct) |
|-----|------------------------|--------------------------|
| `twitter:card` | `summary` (small card) | `summary_large_image` (big preview) |
| `og:image` | Missing | `https://peptshop.io/og-image.png` |
| `og:url` | `peptshop.com` (wrong domain) | `peptshop.io` |

**What's done:**
- ✅ Created `public/og-image.png` (1200×630, dark navy + orange branding, centered) — pushed to main
- ✅ Our `index.html` already has correct tags

**What 0x needs to do:**
1. Change `twitter:card` from `summary` to `summary_large_image`
2. Add `og:image` + `twitter:image` → `https://peptshop.io/og-image.png`
3. Fix `og:url` from `peptshop.com` to `peptshop.io`

**After fix:** X caches embeds — re-post or use X's card validator to refresh.
