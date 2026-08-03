# Use the Huw Owen invoice style for all portal invoices

The portal already generates its PDFs from the same shared template that produced the Huw Owen invoice (A4 bleed header, dual list/discount pricing, letterhead footer with telephone). One gap remains: the portal never tells the template whether an invoice is paid, so a paid invoice still downloads showing bank transfer details and "Total due".

## What changes

- Paid invoices downloaded from the portal, the public invoice link, and the admin Invoices screen will render the **PAID IN FULL** box, **Total paid**, and **Payment status: PAID** — exactly like the Huw Owen document.
- Unpaid invoices keep the bank transfer block, due date and payment reference as they are today.

## Technical detail

- `supabase/functions/invoice-access/index.ts`: pass `status: invoice.status` and `paid_at: invoice.paid_at` into `buildInvoicePdf(...)` in the GET/PDF branch (the only fields currently missing from the payload).
- Redeploy `invoice-access` (and `create-invoice`, `payments-webhook` if unchanged code needs no redeploy — only redeploy what is touched).
- Verify by generating a PDF for one paid and one pending invoice and visually inspecting both pages.

No database, checkout flow, or UI changes are needed.
