# Low stock: keep casks buyable, alert admin

Two changes: low-stock listings stay visible and purchasable in Available Stock with a clear "only X left" signal, and admin gets a Stock Alerts panel plus an email when a listing first drops low or runs out.

## Client portal — Available Stock

- A listing is **low stock** when 3 or fewer casks are unreserved.
- Low-stock listings keep showing on the Available Stock grid and table and stay buyable — no hiding, no disabled Buy button.
- Card shows a copper "Only X remaining" badge when low; listings with zero available show "Reserved" and the Buy button is disabled instead of vanishing mid-session.
- Buy dialog caps the quantity field at what is genuinely available and shows the remaining count, so a client can't build a cart that fails at invoice time.
- Pallet pricing (6+) is only advertised when 6 or more are actually available, as today.

## Admin — Stock Alerts

- New **Stock Alerts** entry in the admin sidebar with a badge showing the number of listings needing attention.
- The page lists every listing at or below the threshold, split into **Out of stock** (0 available) and **Low stock** (1–3 available), each row showing distillery, cask, stock, reserved, available, and a link to edit the listing.
- The Listings table gets an inline amber/red "Low" / "Out" chip on the availability column so it's visible without leaving the page.

## Admin — Email notification

- When a listing's available quantity first crosses to 3 or fewer, and again when it hits 0, one email is sent to the admin notification address.
- Deduplicated: a listing won't email again for the same state until it is restocked above the threshold.
- Email is branded like the existing admin notifications and lists the affected cask, remaining quantity, and a link to the admin Listings page.

## Technical detail

- Migration: add `stock_alert_state` tracking (a small table keyed by `listing_id` recording the last alerted state and timestamp) and extend the existing stock recompute trigger on `cask_listings` / invoices to detect threshold crossings and call the notification path via `net.http_post` to a new `notify-stock-alert` edge function.
- New edge function `supabase/functions/notify-stock-alert/index.ts` (`verify_jwt = false`, service-role guarded by a shared secret header) that sends via `send-transactional-email`.
- New template `admin-low-stock.tsx` registered in `_shared/transactional-email-templates/registry.ts`.
- New admin route/page `src/pages/admin/StockAlerts.tsx` reading `admin_listing_stock()`; sidebar item added in `AdminLayout.tsx`, route in `App.tsx`, badge count from the same RPC.
- `src/pages/portal/AvailableStock.tsx`: low-stock badge, zero-availability handling, quantity cap in the buy dialog using `available_qty` from `listing_availability()`.
- `src/pages/admin/Listings.tsx`: availability chip.
- Threshold constant shared in `src/lib/pallet.ts` (or a new `src/lib/stock.ts`) and mirrored in the SQL trigger.
