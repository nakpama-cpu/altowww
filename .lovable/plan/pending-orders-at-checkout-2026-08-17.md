# Pending Orders at Checkout

Add a third checkout action that creates a pending order (invoice), clears the cart, and moves payment into the Orders page.

## Checkout changes

- Below the order summary total, above the Payment Method block, add a **Create Pending Order** button with a short explainer: the casks are reserved, an invoice is emailed, and payment can be made later from Orders by card or bank transfer.
- Card and Bank Transfer stay exactly as they are today.
- Clicking Create Pending Order calls the existing invoice creation (same reservation and branded invoice email as the current bank transfer flow), then clears the cart and shows a confirmation screen: "Pending order created", the invoice number and total, and buttons for **View in Orders** and **Browse Available Stock**.
- Same verification gate applies (address and identity must be verified).

## Orders page changes

- Orders now also loads invoices with status `awaiting_payment`, shown as **Pending** with an amber badge, listed above paid/confirmed orders.
- Each pending order row expands to the existing invoice view plus two payment actions:
  - **Pay by Card** — opens Stripe checkout for that invoice.
  - **Pay by Bank Transfer** — shows the bank details/reference and the existing "I've made payment" confirmation, marking the invoice `client_confirmed`.
- Status filter gains a "Pending" option.

## Sidebar badge

- Add a count badge next to **Orders** in the portal sidebar (same style as the Checkout cart badge), showing the number of invoices with status `awaiting_payment`. Shown on both desktop sidebar and mobile menu, refreshed when the portal route changes.

## Technical notes

- New lightweight `PendingOrdersContext` (or a small hook used by `PortalLayout`) querying `invoices` filtered to the signed-in user and `status = 'awaiting_payment'`, so the badge and Orders page share one source.
- `Checkout.tsx`: reuse `createInvoice` (the `create-invoice` edge function) for the pending action, then `clear()` the cart and render the confirmation state instead of the inline invoice panel.
- `Orders.tsx`: widen the status filter in the query from `["client_confirmed","paid"]` to include `awaiting_payment`; reuse `InvoiceLoader` for the expanded view.
- Card payment from Orders reuses `create-checkout` with the invoice's line items, so the existing webhook still marks the invoice paid and materialises holdings.
- No database schema changes — `awaiting_payment` already exists in `invoice_status`, and reservations/expiry triggers stay as-is.
