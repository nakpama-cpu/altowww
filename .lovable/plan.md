# Fix "Could not create invoice" at checkout

## What's happening

The Generate Invoice button fails because the backend rejects the cart with `Insufficient stock for Single Malt Scotch` (confirmed in the create-invoice logs). The stock check is doing its job — the problem is that the stock figures themselves are wrong.

Every invoice created reserves stock, but nothing ever releases that reservation. Reservations are still held for invoices that were paid, expired or cancelled, so reserved quantities keep climbing and availability drains away.

Confirmed from the data:
- Glen Mhor: 20 in stock, 18 reserved, only 2 available — yet its reservations come from 6 paid + 6 confirmed + 6 awaiting units.
- Bunnahabhain: 10 reserved, including units from a paid invoice and an expired one.

Two separate faults:
1. Reservations leak (never released on paid / expired / cancelled).
2. The error message shown to the client is generic ("Edge Function returned a non-2xx status code") and internally names the generic spirit ("Single Malt Scotch") instead of the actual cask.

## What changes

1. **Release reservations properly**
   - When an invoice is marked paid: release the reservation and reduce actual stock (the casks have left inventory).
   - When an invoice expires or is cancelled: release the reservation, stock returns to available.
   - Implemented as a database trigger on `invoices` status changes so it applies to bank transfer, card and admin-marked payments alike.

2. **Repair current stock figures**
   - One-off recalculation of `reserved_qty` on every listing so it equals only the units held by genuinely pending invoices (awaiting payment / client confirmed).
   - Adjust `stock_qty` so paid units are accounted for rather than double-counted.

3. **Better checkout errors**
   - The stock error names the specific cask (e.g. "Only 2 Glen Mhor casks remain") using the distillery/spirit name, not the generic "Single Malt Scotch".
   - The checkout toast shows that message instead of "Edge Function returned a non-2xx status code".

## Technical detail

- Migration: trigger function on `public.invoices` AFTER UPDATE OF status — on `paid` call release + decrement stock; on `expired`/`cancelled` call release only. Reuses the existing `reserve_listing_qty` pattern with a matching `release_listing_qty`.
- Migration: backfill `reserved_qty = sum(invoice_items.quantity)` for invoices in pending states, and reconcile `stock_qty` against paid units.
- `supabase/functions/create-invoice/index.ts`: use `distilleries.name` / `spirit_name` in the insufficient-stock message and return the available count.
- `src/pages/portal/Checkout.tsx`: surface the returned error text in the failure toast.
- Redeploy `create-invoice`; verify by generating an invoice for the 9-cask cart in the screenshot.
