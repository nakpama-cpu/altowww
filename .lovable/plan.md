
## Goal
Replace the "one row per individual cask" model on the Available Stock page with **cask listings** that admins manage in bulk. Individual cask numbers are only recorded later, at certificate upload time.

## Data model changes

New table `cask_listings` (admin-managed products):
- distillery_id, spirit, cask_type, fill_date, age_years, abv, ola_litres, rla_litres
- list_price, currency, description, hero_image_url
- `stock_qty` (int) — admin-set total available
- `reserved_qty` (int, default 0) — auto-incremented on order
- status: `active` | `hidden` | `sold_out`
- Computed `available_qty = stock_qty - reserved_qty` (view or client-side)

Modify existing `casks` table (now represents an **individual, certificated cask**):
- Add `listing_id` (FK → cask_listings, nullable for legacy)
- Make `cask_number` nullable (populated at certificate upload)
- Keep `status`: `reserved` | `held` | `sold` (no more `available` — availability now lives on the listing)

Modify `orders`:
- Add `listing_id` (nullable FK) — order is placed against a listing
- `cask_id` becomes nullable — assigned by admin later when the individual cask + certificate is ready

Wipe existing rows where `casks.status = 'available'` (holdings/sold casks preserved, as they're referenced by `holdings`/`orders`).

Trigger: on order insert against a listing, increment `reserved_qty` and flip listing to `sold_out` when `reserved_qty >= stock_qty`. On order cancel/delete, decrement.

## Admin panel changes

**New page: `/admin/listings`** (replaces day-to-day use of `/admin/casks`):
- Table of listings with distillery, spirit, price, `stock_qty`, `reserved_qty`, `available_qty`, status
- Create/edit form with all listing fields + stock quantity input
- Stock number is **only visible here** (admin-only)

**`/admin/holdings` (certificate upload flow) — updated:**
- "Assign Cask" form now picks: client + **listing** (not cask) + cask number (text input, entered at this point) + purchase price + date + certificate PDF
- On submit: creates a `casks` row (with the newly-entered cask_number, linked to the listing), creates the `holding`, uploads the certificate, and — if this fulfils a pending order — links the order to the new cask row.
- New "Pending fulfilment" section: lists orders with `cask_id IS NULL`, so admin knows which listings need a certificated cask assigned.

**`/admin/casks`** kept for editing legacy/individual cask records but de-emphasised in nav.

## Client portal changes

**`/portal/available`:**
- Reads from `cask_listings` where `status = 'active'` (i.e. `available_qty > 0`)
- One card per listing — no quantity, no stock badge, no counts
- "Add to cart" / "Buy" targets the listing, not an individual cask

**Cart / Checkout:**
- Cart items reference `listing_id` instead of `cask_id`
- On order creation, `orders.listing_id` is set; `orders.cask_id` stays null until admin assigns

**`/portal/my-casks`:**
- Shows the client's `holdings` (unchanged) plus any orders still awaiting cask assignment ("Certificate pending" state).

## Out of scope
- Changing the holdings/certificate storage bucket structure.
- Editing marketing pages or the checkout UI beyond swapping the id being sent.
- Historical `orders` referencing individual casks stay linked to those casks.

## Technical section

**Migration order (single migration):**
1. `CREATE TABLE public.cask_listings (...)` with GRANTs (`authenticated` SELECT, `service_role` ALL), RLS on, policies: anyone signed-in reads active listings; admins full access.
2. `ALTER TABLE public.casks ADD COLUMN listing_id uuid REFERENCES cask_listings(id)`, `ALTER COLUMN cask_number DROP NOT NULL`.
3. `ALTER TABLE public.orders ADD COLUMN listing_id uuid REFERENCES cask_listings(id)`, `ALTER COLUMN cask_id DROP NOT NULL`.
4. Trigger `bump_listing_reserved()` on `orders` insert/delete to keep `reserved_qty` in sync and update `status` to `sold_out` when full.
5. `DELETE FROM casks WHERE status = 'available'` (safe: `holdings`/`orders` reference only sold/held rows).
6. Update `enforce_order_amount` trigger to pull `list_price`/`currency` from `cask_listings` when `listing_id` is set (fallback to `casks` for legacy orders).

**Frontend files touched:**
- New: `src/pages/admin/Listings.tsx`, route in `App.tsx`, nav entry in `AdminLayout.tsx`.
- Edit: `src/pages/admin/Holdings.tsx` (new assignment flow + pending fulfilment list).
- Edit: `src/pages/portal/AvailableStock.tsx` (read from listings, remove stock counts).
- Edit: `src/contexts/CartContext.tsx` (cart item shape: `listing_id`).
- Edit: `src/pages/portal/Checkout.tsx` (send `listing_id`).
- Edit: `src/pages/portal/MyCasks.tsx` (show pending-assignment orders).
- Regenerated `src/integrations/supabase/types.ts` after migration.

**Data wipe:** `DELETE FROM casks WHERE status='available'` runs inside the migration; user has explicitly approved wiping existing available casks.
