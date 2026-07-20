# Connect Stripe to the Alto Whisky Portal

## 1. Enable Stripe Payments (built-in)
- Use Lovable's built-in Stripe Payments integration. During enable, you'll be prompted to sign in to Stripe and connect your **existing** Stripe account — nothing new is created, and your existing bank/payout details are used.
- A test (sandbox) environment is activated immediately so we can test with no real money. Live payments switch on once your Stripe account is verified.
- Tax handling: because casks are physical goods with storage/delivery, Stripe's full "compliance handling" isn't eligible. We'll enable **Stripe Tax (calculation + collection only)** at +0.5% per transaction. You handle registration, filing and remittance; Stripe alerts you when nearing thresholds. This can be turned off later.

## 2. Product & pricing model
Casks vary in price per listing, so we won't pre-create a Stripe Product per cask. Instead:
- Checkout creates a Stripe Checkout Session on the fly with **line items priced from `cask_listings.list_price`** (server-side, never trust client prices).
- Currency taken from the listing (`GBP` default).
- Physical-goods tax code applied to line items so Stripe Tax calculates correctly.

## 3. Checkout edge function (`create-checkout`)
New Supabase edge function that:
1. Requires an authenticated, KYC-verified user (address + DOB approved).
2. Re-reads cart items from `cask_listings` by `listing_id` to get authoritative prices/currency/stock.
3. If a discount code is supplied, re-runs `validate_discount_code` server-side and applies the **greater of** any allowed discount (matching the existing rule).
4. Creates a Stripe Checkout Session (`mode: payment`, `automatic_tax: enabled`, `shipping_address_collection` for UK, success/cancel URLs back to the portal).
5. Inserts a `pending` row into `orders` with the Stripe session id, cart snapshot, applied code, subtotal, discount, total.
6. Returns the Stripe URL; frontend redirects to Stripe-hosted checkout (your branding, no Lovable branding).

## 4. Webhook edge function (`stripe-webhook`)
Handles `checkout.session.completed` and `payment_intent.payment_failed`:
- Verifies signature using `STRIPE_WEBHOOK_SECRET`.
- On success: mark the matching `orders` row `paid`, decrement `cask_listings.available_qty` (via existing reserved/available triggers), mark the discount code as used for that client (one-use-per-client rule).
- On failure/expiry: mark order `failed` and release any reservation.
- Deployed with `verify_jwt = false` so Stripe can reach it.

## 5. Success / cancel pages
- `/portal/checkout/success?session_id=…` — confirms order, clears cart, links to My Casks.
- `/portal/checkout/cancelled` — returns to cart with items intact.

## 6. Frontend changes
- `Checkout.tsx`: replace the current "Place order" action with "Pay with card", which calls `create-checkout` and redirects to Stripe.
- Keep the existing discount-code input and verification-gate banner.
- Add a small "Payments secured by Stripe" note.

## 7. Secrets
Lovable's built-in Stripe integration manages `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` for you — no manual key pasting.

## 8. Testing checklist (sandbox)
- Buy 1 cask, no code → order `paid`, stock decrements.
- Buy 2 casks with valid code assigned to that client → discount applied server-side, one-use flag set.
- Buy with an unverified account → blocked by verification gate.
- Card decline (Stripe test card `4000 0000 0000 0002`) → order `failed`, stock unchanged.
- Refresh after success → no duplicate order (idempotent on `session_id`).

## Technical section
- New files: `supabase/functions/create-checkout/index.ts`, `supabase/functions/stripe-webhook/index.ts`, `src/pages/portal/CheckoutSuccess.tsx`, `src/pages/portal/CheckoutCancelled.tsx`.
- Migration: add `stripe_session_id text unique`, `stripe_payment_intent text`, `status` enum values (`pending|paid|failed|cancelled`) to `orders` if not present; index on `stripe_session_id`.
- `config.toml`: `verify_jwt = false` for `stripe-webhook` only.
- Routes added in `App.tsx` for success/cancelled pages.

## What I need from you to proceed
1. Confirm you want to enable Stripe Payments now (you'll be prompted to sign in to your Stripe account during enablement).
2. Confirm **Stripe Tax (calc + collect only, +0.5%)** is OK, or say "no tax automation" if you'd rather handle it entirely yourself.
