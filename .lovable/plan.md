## Goal
When a signed-in user clicks "Client Login" from a marketing page, take them straight into the portal — skipping the login modal — unless they haven't visited any portal page in the last 15 minutes, in which case make them sign in again.

## Changes

### 1. Track last portal visit (`src/pages/portal/PortalLayout.tsx`)
Add a `useEffect` on `location.pathname` that writes `Date.now()` to `localStorage` under the key `alto:lastPortalVisit` every time an authenticated user renders a `/portal/*` route (this component is already gated by `ProtectedRoute`, so a visit implies an active session).

### 2. Smart "Client Login" behaviour (`src/components/Header.tsx`)
Replace the two `setLoginOpen(true)` handlers (desktop button ~line 162, mobile button ~line 217) with a shared `handleClientLogin` that:

- Reads `useAuth()` — `{ user, signOut }`.
- Reads `localStorage.getItem("alto:lastPortalVisit")`.
- If `user` exists AND `lastVisit` is within the last 15 minutes (`Date.now() - lastVisit < 15 * 60 * 1000`) → `navigate("/portal")`. No modal.
- If `user` exists but the timestamp is missing or older than 15 min → call `await signOut()`, clear the stored timestamp, then open the login modal as today.
- If no `user` → open the login modal (current behaviour).

The 15-minute window is a soft client-side rule for UX only; Supabase session expiry is unchanged and continues to govern real auth.

### 3. No other files change
`AuthContext`, `ProtectedRoute`, `LoginModal`, and Supabase config are untouched. The `MyCasks`, `AvailableStock`, etc. pages inherit the tracking through `PortalLayout`.

## Verification
- Sign in, navigate to `/`, click Client Login → should land on `/portal` directly.
- Sign in, wait 15+ minutes off-portal (or manually set `alto:lastPortalVisit` to an old value in devtools), click Client Login → should sign out and show the login modal.
- Signed-out visitor clicks Client Login → login modal opens as before.