# Project Architecture

- Use the supplied public GoHighLevel calendar as the booking iframe default while allowing `VITE_GHL_PUBLIC_CALENDAR_URL` to override it; public embed URLs only, never credentials.
- Keep the GoHighLevel booking iframe inside the `/book-a-call` modal so the public page remains a focused, branded introduction.
- GA4 loading, consent, safe context and event emission stay in `src/lib/analytics.ts`, with `AnalyticsConsent` in the marketing layout; homepage measurement and delegated allowlisted attribution live in `src/lib/homepageAnalytics.ts`, mounted per homepage visit, so private paths and previews stay untracked without layout wrappers or duplicate click handlers.
