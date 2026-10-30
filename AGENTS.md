# Project Architecture

- Keep individual pallet invoice emails as separately registered templates so later pallet details and payment links never overwrite earlier client correspondence.

- Use the supplied public GoHighLevel calendar as the booking iframe default while allowing `VITE_GHL_PUBLIC_CALENDAR_URL` to override it; public embed URLs only, never credentials.
- Keep the GoHighLevel booking iframe inside the `/book-a-call` modal so the public page remains a focused, branded introduction.
- GA4 lives only in `src/lib/analytics.ts` + `AnalyticsTracker` (no UI) mounted in the marketing layout; it loads automatically only on the live public domains and never on portal/admin/invoice/auth/checkout paths or previews, so private areas stay untracked.
- GHL public page events use only the thin `ghlPageTracking` sender alongside GA in `AnalyticsTracker`; reuse analytics guards/sanitizers, read guide identity only for GHL, and reset route dedupe on marketing unmount to avoid private tracking or persistent vendor observers.
