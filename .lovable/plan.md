## Goal

Standardise how cask specs display across the portal (Available Stock cards, cask detail dialog, My Casks) and add automatic pallet pricing.

## Schema changes (casks + cask_listings)

Add two new columns to both `public.casks` and `public.cask_listings`:

- `wood` text — e.g. "Ex-Bourbon", "Oloroso Sherry", "PX Sherry", "Virgin Oak"
- `cask_size_litres` numeric(6,1) — e.g. 200, 250, 500

Keep existing `cask_type` but repurpose it to hold the shape only: "Barrel", "Hogshead", "Butt", "Puncheon". A one-off data migration parses current values (e.g. "First-fill Bourbon Barrel" → wood="Ex-Bourbon", cask_type="Barrel", size inferred from shape defaults: Barrel 200, Hogshead 250, Butt 500).

`fill_date` and `age_years` stay — Year is derived from `fill_date` (year part), Age is the existing `computeCaskAge` helper.

## Display rules

Standard spec block used on Available Stock cards, cask detail dialog, and My Casks cards:

```
Spirit            Distillery
Cask Type         Wood
ABV               Year
Age               [OLA or RLA — see below]
```

- **Cask Type** renders as `{cask_type} {cask_size_litres}L` (e.g. "Barrel 200L").
- **Year** = year portion of `fill_date`.
- **Age** = `computeCaskAge(fill_date)` in whole years.
- **OLA / RLA rule**: if `rla_litres` is set, show "RLA — 148L"; otherwise show "OLA — 200L". Never both.
- **Available Stock**: hide OLA/RLA entirely (as today) — those are per-cask and only meaningful once a certificate is issued.
- **My Casks**: show the RLA-or-OLA row per the rule above.

Admin panels (`Listings.tsx`, `Casks.tsx`, `Holdings.tsx`) get the new inputs: Wood dropdown, Cask Type dropdown (Barrel/Hogshead/Butt/Puncheon), Size (L) number field.

## Pallet pricing (7.5% off when 6+ of the same listing)

Applies **per listing**, not across the cart. When a client has 6 or more units of the same `listing_id` in their cart, the unit price on that line is reduced by 7.5%.

UI:

- Available Stock card: for any listing with `stock_qty >= 6`, show a small "Pallet price — £X,XXX ea. for 6+" line under the list price.
- Cask detail dialog: same badge plus a note ("Automatically applied when 6+ purchased").
- Checkout: line items show reduced unit price and a "Pallet price applied (−7.5%)" tag when qty ≥ 6.

Interaction with discount codes: **greater of the two wins**, matching the existing "no stacking" rule. Backend enforcement lives in `enforce_order_amount`:

- Compute pallet discount% = 7.5 if that line's quantity ≥ 6 else 0.
- Compute code discount% as today.
- Effective discount = `GREATEST(pallet_pct, code_pct)`.
- Apply to `list_price` when writing `amount`.

Because orders currently store one `listing_id` per order row, quantity is inferred from the number of order rows created for the same checkout/listing combination. The trigger will look up sibling order rows in the same `checkout_session_id` for that `listing_id` to decide whether the ≥6 threshold is met.

## Files touched

- Migration: add `wood`, `cask_size_litres` to `casks` and `cask_listings`; backfill from existing `cask_type`; update `enforce_order_amount` for pallet pricing.
- `src/pages/portal/AvailableStock.tsx` — new spec layout, pallet price badge, hide OLA/RLA.
- `src/pages/portal/MyCasks.tsx` — new spec layout, RLA-replaces-OLA rule.
- `src/pages/portal/Checkout.tsx` + `src/contexts/CartContext.tsx` — per-listing quantity-aware unit price, pallet tag.
- `src/pages/admin/Listings.tsx`, `src/pages/admin/Casks.tsx`, `src/pages/admin/Holdings.tsx` — Wood / Cask Type / Size inputs.
- `src/integrations/supabase/types.ts` — regenerated after migration.

## Delivery

Use a subagent to draft the full edits in parallel across the six frontend files against the new schema, then apply the migration first and the code changes after types regenerate.

## Out of scope

- No change to certificates, KYC, or Stripe flow.
- No change to how discount codes are assigned or validated (only how the effective % is combined with pallet pricing).
