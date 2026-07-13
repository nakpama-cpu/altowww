
## What we're building

The portal already puts new signups in a `pending` state and blocks them from portfolio features until an admin flips them to `approved`. This plan adds the missing pieces around that:

1. **Admin notification email** to `admin@altowhisky.com` the moment a client registers.
2. **One-click Approve / Reject links** inside that email (secure, single-use tokens) — no login required to action.
3. **Improved Pending Approvals view** inside the existing Admin → Clients page (pending users pinned to the top with clear Approve / Reject buttons).
4. **Approval email to the client** from `admin@altowhisky.com` letting them know they can now sign in.
5. No email on rejection (per your answer).

## User flow

```text
Client signs up
   │
   ├─► profile created with status = 'pending'  (already happens)
   ├─► admin@altowhisky.com receives "New client awaiting approval" email
   │       with Approve / Reject buttons + link to Admin → Clients
   │
Admin clicks Approve (in email OR in-app)
   │
   ├─► profile.status = 'approved'
   ├─► client receives "Your Alto Whisky portal is ready" email
   │       from admin@altowhisky.com
   │
Client signs in → full portal access
```

## Prerequisites (email infrastructure)

Sending from `admin@altowhisky.com` needs a verified sender subdomain on `altowhisky.com` (e.g. `notify.altowhisky.com`). If this isn't set up yet, I'll open the email setup dialog so you can add the DNS records; scaffolding proceeds either way and emails start flowing once DNS verifies.

## Technical details

**Database (single migration)**
- New table `public.approval_tokens` — one row per pending profile, columns: `profile_id`, `token` (random), `action` (`approve` | `reject`), `expires_at`, `used_at`.
- Row is created by a trigger on `profiles` insert (only when `status = 'pending'`).
- RLS locked down; only the edge function (service role) reads/writes it.

**Edge functions**
- `notify-new-signup` — triggered from an `AFTER INSERT` webhook via `pg_net`, or invoked from the signup form as a fallback. Renders the admin email using the app email system and enqueues it via `send-transactional-email` with template `admin-new-signup`.
- `approve-client` — public HTTP endpoint hit by the email links. Validates token, sets `profile.status` accordingly, marks token used, and (on approve) enqueues the `client-approved` email. Renders a small branded confirmation page.

**Email templates** (added to the app email registry)
- `admin-new-signup` — client's name, email, phone, timestamp, Approve / Reject buttons pointing at `approve-client?token=…&action=…`, plus a link to `/admin/clients`.
- `client-approved` — signed as "The Alto Whisky Team", From: `admin@altowhisky.com`, CTA button to `/portal/login`.

Both use the existing brand palette (cream / dark blue, copper accents, Cormorant + Inter).

**Admin UI (`src/pages/admin/Clients.tsx`)**
- Add a "Pending approvals" section pinned above the main table showing pending users as cards with **Approve** and **Reject** buttons.
- The existing status dropdown / discount fields stay for full control.
- Small badge in the admin nav showing the pending count.

**Signup page**
- After successful `supabase.auth.signUp`, invoke `notify-new-signup` so the admin email fires even before the DB webhook (belt-and-braces). No change to what the client sees.

**Config**
- Admin recipient stored as a Supabase secret `ADMIN_NOTIFICATION_EMAIL` (defaults to `admin@altowhisky.com`) so it's easy to change later without a redeploy.

## Out of scope

- No rejection email to clients (per your answer).
- No changes to how clients are gated in the portal — `ProtectedRoute` already redirects non-approved users to `/portal/pending`.
