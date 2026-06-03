## Client Portal — Build Plan

A gated portal at `/portal` where approved clients view their cask holdings, browse available stock, request advisor callbacks, and purchase casks via Stripe. Includes an admin dashboard for you to manage clients, casks, and orders.

### 1. Authentication & approval flow
- Email/password + Google sign-in (Lovable Cloud managed).
- New signups land in `pending` status; they see a "Awaiting approval" screen until you approve them in the admin dashboard.
- Roles via dedicated `user_roles` table (`admin`, `client`) with a `has_role()` security-definer function — no role on profile (prevents privilege escalation).
- `/portal/login`, `/portal/signup`, `/portal/forgot-password`, `/portal/reset-password` pages.

### 2. Database schema (new tables)
- `profiles` — id (=auth.users.id), first_name, last_name, phone, status (`pending`/`approved`/`suspended`), client_discount_pct, created_at.
- `user_roles` — user_id, role enum.
- `distilleries` — name, region, logo_url.
- `casks` — id, cask_number, distillery_id, spirit, cask_type, fill_date, abv, ola_litres, rla_litres, age_years, list_price, status (`available`/`reserved`/`held`/`sold`), description, hero_image_url.
- `holdings` — id, owner_id → profiles, cask_id → casks, purchase_price, purchase_date, certificate_url, notes.
- `callback_requests` — id, requester_id, reason, message, status, created_at.
- `orders` — id, buyer_id, cask_id, amount, currency, status (`pending`/`paid`/`cancelled`), stripe_session_id, created_at.
- `cask-certificates` private storage bucket (PDF per holding, admin uploads, owner downloads via signed URL).
- `cask-images` public bucket for stock photos.
- RLS: clients see only their own profile/holdings/orders/callbacks; everyone approved sees `available` casks; admin sees all.

### 3. Client portal pages (`/portal/*`)
- **Dashboard** — portfolio summary (total casks, total purchase value, estimated current value placeholder), most recent holding, quick links.
- **My Casks** — table/grid of holdings: cask #, distillery, spirit, cask type, OLA, ABV, fill date, purchase date, purchase price, certificate download button.
- **Cask detail** — full spec sheet for a holding.
- **Available Stock** — grid of `available` casks with filters (distillery, spirit, cask type, age). Each card shows list price (and client's discounted price if `client_discount_pct > 0`) with a "Buy" button.
- **Checkout** — Stripe Checkout session for the selected cask; webhook marks cask `reserved`, creates an `orders` row, and notifies admin.
- **Request Callback** — form (reason dropdown, message) writing to `callback_requests`.
- **Account** — name, phone, password change.

### 4. Admin dashboard (`/admin/*`, gated by `admin` role)
- **Clients** — list, approve/suspend, set per-client discount %.
- **Casks** — CRUD with image upload; mark status.
- **Holdings** — assign a cask to a client, set purchase price/date, upload certificate PDF.
- **Distilleries** — CRUD.
- **Callback requests** — inbox view with status updates.
- **Orders** — view paid orders so you can fulfil and convert to holdings.

### 5. Payments
- Enable Lovable's built-in Stripe Payments (no API key needed from you).
- Each `available` cask becomes a Stripe product/price on creation.
- Edge function creates checkout session; webhook marks order paid and cask reserved. Conversion to a permanent holding stays a manual admin step (so you can record certificate + final purchase price).

### 6. Email notifications
- Use Lovable transactional email (no third-party setup) for: new signup → notify admin; account approved → notify client; callback requested → notify admin; order paid → notify client + admin.

### 7. Navigation
- Header gains a "Client Login" link (right side). Once logged in it becomes "My Portfolio".
- Portal uses its own layout (sidebar nav, no marketing footer) so it feels like a real dashboard while keeping Cormorant/Inter typography and copper accents.

### Technical notes
- New routes added in `App.tsx` under `/portal/*` and `/admin/*`; both wrapped in `<ProtectedRoute>` and `<AdminRoute>` components.
- `onAuthStateChange` listener + `getUser()` for auth checks (never trust `getSession()` alone for role checks).
- Build order: (1) migration for tables + roles + RLS + buckets, (2) auth pages + protected routes + portal shell, (3) admin dashboard, (4) Stripe enable + checkout flow, (5) transactional email scaffolding.

### What I need from you before starting
1. Confirm enabling **Stripe Payments** (Lovable-managed, no API key required from you). Acceptable?
2. Confirm I should set up **email/password + Google sign-in** as the auth methods.
3. Your **admin email** — I'll grant it the `admin` role automatically on first signup so you can immediately manage the portal.
