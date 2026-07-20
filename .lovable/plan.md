
# Client Portal Polish

Scope is polish-only — no structural changes to pages or features. Same routes, same palette (cream / navy / copper), same fonts (Cormorant Garamond + Inter). One new feature: an activity feed on the Dashboard.

## 1. Sidebar refinements

- Add a compact **portfolio summary block** at the top of the sidebar under the logo: casks held + total value, with a small "Verified" badge if KYC is approved. Static values reused from existing profile/holdings queries — no new backend.
- Tighten nav item spacing, slightly larger icons, softer hover state (subtle copper underline instead of full background).
- Move "Signed in / Test Client / Sign out" into a cleaner grouped footer with a small avatar circle (initials).

## 2. Dashboard polish

- Replace the three plain metric tiles with a **hero portfolio card** (spans full width): large value, casks held count, most-recent cask as secondary text, subtle copper hairline divider.
- Convert the two "shortcut" boxes (View My Casks / Browse Available) into a 3-up quick actions row with icons (My Casks, Available Stock, Request Callback).
- **NEW: Activity feed** on the right (desktop) / stacked below (mobile). Shows the last ~8 events, most recent first:
  - New order placed / paid
  - Verification status changes (address, age)
  - New cask listings that just became available
  - Admin messages / callback confirmations
  
  Backend: read-only aggregation from existing tables (`orders`, `profiles.address_verification_status` + `age_verification_status`, `cask_listings.created_at`, `callback_requests`) via a single client-side query on Dashboard mount. No new tables needed initially — if we later want persistent notifications we can add one, but out of scope here.

## 3. My Casks polish

- Add a slim **coloured left border** per card keyed to distillery region (Speyside, Islay, Highland, Lowland, Campbeltown) to give quick visual differentiation.
- Add a **maturation micro-bar** under the cask header: fill-date → today → 18yr optimal marker. Not the full timeline feature — a single thin progress line with two dots. Read-only, computed client-side.
- Tighten label/value spacing in the spec grid; make "View Certificate" a copper outline button aligned right on desktop, full-width on mobile.

## 4. Available Stock polish

- Redesign the **empty state**: centred illustration (existing whisky/cask line art), heading "No casks available right now", subcopy, and two CTAs — "Notify me when new stock arrives" (drops a row into existing `leads` table with type `stock_alert`) and "Request a callback".
- Filter bar: unify heights, softer borders, group the view-toggle (grid / table) to the right with a subtle divider.

## 5. Account polish

- Small refinements only (the modals were reworked recently): tighten the Profile card header, standardise badge sizing, ensure the Verified pill in the header matches the sidebar badge style.

## 6. Cross-cutting

- Standardise card radius (`rounded-xl`), shadow (`shadow-sm` at rest, `shadow-md` on interactive hover), and off-white surface (`bg-muted/20`) across all portal pages.
- Typography: bump body line-height slightly for readability; tighten heading tracking.
- Add page-transition fade (150ms) between portal routes for polish.
- Mobile: ensure the new hero portfolio card and activity feed stack cleanly, sidebar drawer keeps the summary block.

## Out of scope (per "polish only")

- No charts, allocation breakdown, or maturation timeline page.
- No notifications table / read-receipts (activity feed is a live query only).
- No changes to Checkout, Login, Signup, Admin pages.

## Technical notes

- All colour changes route through `index.css` tokens — no hardcoded hex in components.
- Activity feed built as `src/components/portal/ActivityFeed.tsx`, consumed by `Dashboard.tsx`.
- Sidebar summary as `src/components/portal/SidebarSummary.tsx`.
- Region-colour map in `src/lib/regions.ts` (small lookup keyed off `distilleries.region`).
