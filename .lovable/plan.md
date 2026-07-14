## Goal

Give every page in the sitemap a correct self-referencing canonical, so Google attributes each URL to itself instead of the homepage.

## Current state

- `react-helmet-async` is wired up (`HelmetProvider` in `src/main.tsx`).
- `src/components/Seo.tsx` already emits `<link rel="canonical">`, `og:url`, and per-route og/twitter title/description.
- Marketing pages already use `<Seo>`: Index, HowItWorks, WhyWhisky, AboutWhisky, HowWhiskyIsMade, FAQ, Contact, News, ArticlePage.
- **Missing canonicals**: the four portal auth pages we just added to the sitemap — Login, Signup, ForgotPassword, ResetPassword.
- **Duplicate canonical bug**: `index.html` still hardcodes `<link rel="canonical" href="https://www.altowhisky.com/" />`. Helmet's per-route `<link>` does not dedupe by `rel`, so on every non-home route two canonicals ship — one pointing to `/` and one to the real URL. Google may pick either; this silently undermines the whole per-page setup.

## Changes

### 1. `index.html`

Remove the sitewide `<link rel="canonical" href="https://www.altowhisky.com/" />`. The homepage will get its canonical from `<Seo path="/">` in `src/pages/Index.tsx` (already present). Every other route already sets its own via `<Seo>`. Leave the sitewide `og:*` tags in place — they're the fallback for non-JS social crawlers.

### 2. Add `<Seo>` to the four portal auth pages

Each gets a self-referencing canonical, a real title/description, and `og:url` pointing at the page itself. These pages are functional entry points, not marketing content, so descriptions are short and factual.

- `src/pages/portal/Login.tsx` — `path="/portal/login"`, title `Client Sign In | Alto Whisky`, description `Sign in to your Alto Whisky client portal to view your cask portfolio and available stock.`
- `src/pages/portal/Signup.tsx` — `path="/portal/signup"`, title `Create a Client Account | Alto Whisky`, description `Open an Alto Whisky client account to access cask investment opportunities and portfolio tools.`
- `src/pages/portal/ForgotPassword.tsx` — `path="/portal/forgot-password"`, title `Reset Your Password | Alto Whisky`, description `Request a password reset link for your Alto Whisky client account.`
- `src/pages/portal/ResetPassword.tsx` — `path="/portal/reset-password"`, title `Set a New Password | Alto Whisky`, description `Set a new password for your Alto Whisky client account.`

### Out of scope

- Authenticated portal pages (Dashboard, MyCasks, AvailableStock, Checkout, Callback, Account, PendingApproval, PortalNews) and admin pages — not in the sitemap, no canonical needed.
- `NotFound` — 404s should not have a canonical.

## Verification

After publish: `curl -s https://www.altowhisky.com/portal/login | grep -i canonical` should show a single canonical to `/portal/login`, and the homepage should show only one canonical to `/`. Then re-inspect the four auth URLs in Search Console; canonical should read as `User-declared canonical` matching the URL itself.
