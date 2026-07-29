Scope
Add client-side search, filter, and sort controls to the portal `/portal/orders` page (the client's own order history). No backend changes are required; data is already fetched in full per user and filtered/sorted in the UI.

Requirements (from clarifying questions)
- Search: invoice number and cask details (distillery, spirit, cask type, wood, vintage, ABV).
- Filters: payment method (Card / Bank transfer), status (Paid / Payment confirmed), date range, amount range, and cask details (distillery/spirit/cask type/wood).
- Sort: date with most recent first by default, plus an option to reverse to chronological order.

Implementation plan

1. State and data model
   - Add local state for `search`, `filterPaymentMethod`, `filterStatus`, `filterDateFrom`, `filterDateTo`, `filterMinAmount`, `filterMaxAmount`, `filterCaskDetail`, and `sortBy`.
   - Keep the existing `Order` and `InvoiceItem` types; no schema changes are needed.

2. Filter logic
   - Compute `filteredRows` with `useMemo` against the loaded `rows` array.
   - Match `search` against `invoice_number`, `payment_reference`, and the joined cask details.
   - Match `filterCaskDetail` against the `distillery`, `spirit`, `cask_type`, and `wood` fields of each invoice item.
   - Apply `payment_method` and `status` equality filters.
   - Apply date range against the order date (`paid_at` ?? `client_confirmed_at` ?? `issued_at`).
   - Apply amount range against `total`.

3. Sort logic
   - Default sort: most recent first.
   - Toggle: chronological order (oldest first).
   - Sort key is the effective order date.

4. UI controls
   - Add a filter bar above the order list using the existing portal patterns (styled `<Input>` and `<select>` elements with muted background, border, and uppercase labels, similar to `AvailableStock.tsx`).
   - Controls layout: responsive grid (mobile 2-column, desktop 4–6 column) so it does not break the narrow `max-w-4xl` container.
   - Add a "Clear" button to reset all filters/sort.

5. Empty state
   - Update the existing empty state to distinguish between "no orders" and "no orders match your search/filters".

6. Admin orders page
   - Leave unchanged in this scope unless requested; the user specifically asked for "my orders".

Verification
- Type-check the modified component.
- Sign in as the test user and confirm that the orders list can be searched, filtered, and sorted as expected.
- Confirm that the default sort remains "most recent first".
- Confirm that clearing filters restores the full list.
