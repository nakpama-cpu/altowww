## Goal

Rebuild the Google sitemap so it lists only pages that should be publicly discovered: the marketing site plus the four unauthenticated portal auth pages (login, signup, forgot-password, reset-password). Exclude every admin route and every authenticated portal route.

## What stays in the sitemap

Marketing (unchanged):
- `/`
- `/how-it-works`
- `/why-whisky`
- `/about-whisky`
- `/how-whisky-is-made`
- `/faqs`
- `/contact`
- `/news`
- `/news/:slug` (auto-generated from `src/data/articles.ts`)

Newly added (client-facing auth entry points):
- `/portal/login` — priority 0.5, changefreq monthly
- `/portal/signup` — priority 0.5, changefreq monthly
- `/portal/forgot-password` — priority 0.3, changefreq yearly
- `/portal/reset-password` — priority 0.3, changefreq yearly

## What stays out of the sitemap (and why)

Authenticated portal routes — no value to Google, gated content:
- `/portal` (Dashboard), `/portal/my-casks`, `/portal/available`, `/portal/news`, `/portal/checkout`, `/portal/callback`, `/portal/account`
- `/portal/pending` (account-review holding page)

Admin routes — private staff area:
- `/admin`, `/admin/casks`, `/admin/holdings`, `/admin/distilleries`, `/admin/callbacks`, `/admin/orders`

Also excluded:
- `/portal/reset-password` — reconsidered: technically it only works with a token in the URL, but including the bare page is harmless and matches your instruction. Kept in the sitemap as requested.
- The catch-all `*` / NotFound route — never indexable.

## Technical changes

1. **`scripts/generate-sitemap.ts`** — append four entries to the `entries` array:
   ```ts
   { path: "/portal/login", changefreq: "monthly", priority: "0.5" },
   { path: "/portal/signup", changefreq: "monthly", priority: "0.5" },
   { path: "/portal/forgot-password", changefreq: "yearly", priority: "0.3" },
   { path: "/portal/reset-password", changefreq: "yearly", priority: "0.3" },
   ```
   The generator runs on `predev`/`prebuild` and rewrites `public/sitemap.xml` automatically.

2. **`public/robots.txt`** — currently `Disallow: /portal/` blocks the four auth pages we're now advertising. Add explicit `Allow:` lines above the `Disallow` in every `User-agent` block so crawlers can reach the auth pages while the rest of `/portal/` stays blocked:
   ```
   Allow: /portal/login
   Allow: /portal/signup
   Allow: /portal/forgot-password
   Allow: /portal/reset-password
   Disallow: /portal/
   ```
   Keep existing `Disallow: /login` and `Disallow: /signin` (legacy paths). No admin rule needed because `/admin` isn't linked anywhere crawlable and isn't in the sitemap; optionally add `Disallow: /admin/` for defence in depth — recommended, included.

3. No changes to route code, no changes to page components.

## Verification

After the edit, `bunx tsx scripts/generate-sitemap.ts` regenerates `public/sitemap.xml`; the file should contain 12 marketing/auth `<url>` entries plus one per article slug, and no `/admin` or authenticated `/portal/*` entries.
