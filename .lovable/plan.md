## Goal

Let clients choose **Pay by card (Stripe)** or **Pay by bank transfer** at checkout. Bank transfer generates a branded invoice they can download immediately, emails it to them as a PDF attachment, and includes a "I've made the payment" confirmation link that notifies your admin inbox.

## Checkout flow

```text
Cart -> Choose payment method
         |-- Card  -> existing Stripe embedded checkout (unchanged)
         |-- Bank  -> invoice created + casks reserved (3 day hold)
                       -> Download PDF on screen
                       -> Branded email with PDF attached
                       -> "Confirm payment sent" page
                       -> Admin notification email
```

## What gets built

**1. Invoices in the database**
- New `invoices` table: invoice number, client, line items snapshot, subtotal/discount/total, currency, payment reference, status (`awaiting_payment`, `client_confirmed`, `paid`, `cancelled`, `expired`), due date, confirmation token.
- Sequential invoice numbers in the format `AW-2026-0001` (year-based, resets annually).
- Payment reference for the transfer derived from the invoice number (e.g. `AW260001`) so you can match transfers on your bank statement.
- Casks reserved on invoice creation; due date set to **3 days**. A scheduled job releases the reservation and marks the invoice `expired` if not confirmed/paid.
- Access rules: clients see only their own invoices; admins see all.

**2. Checkout UI**
- A payment-method selector on the checkout summary: *Card* or *Bank transfer*.
- Bank transfer creates the invoice, then shows a confirmation screen with: invoice number, amount, bank details, payment reference, due date, a **Download invoice (PDF)** button, and a **I've made the payment** button.
- Existing KYC gate, discount codes and pallet pricing apply identically to both methods.

**3. Branded invoice PDF**
- Alto Whisky branded layout: wordmark, company registered name/address/company number, invoice number and dates, client name and verified address, per-cask line items (distillery, spirit, cask type, wood, ABV, year, qty, unit price, line total), discounts, total, bank details block and payment reference, plus your standard footer disclaimers.
- Generated server-side so the same PDF is used for both download and email attachment.

**4. Emails**
- New branded transactional template **"Invoice — bank transfer"** sent to the client with the PDF attached, showing purchase details, bank details, reference, due date, and a prominent button linking to the payment-confirmation page.
- New template **"Bank transfer confirmed by client"** sent to your admin address with invoice number, client name/email, amount, reference, and cask list.

**5. Payment confirmation page**
- Public route reached from the email link, validated by the invoice's one-time token (works even if the client isn't signed in).
- Client confirms with an optional reference/date note; invoice moves to `client_confirmed` and the admin email fires.

**6. Admin panel**
- New **Invoices** section: list with status filters, view/download the PDF, and actions to mark **Paid** (converts to a confirmed order, same as a successful Stripe payment) or **Cancel** (releases reserved stock).

## Technical notes

- New tables `invoices` and `invoice_items` with RLS + grants; invoice numbering via a Postgres sequence and a generation function.
- New edge functions: `create-invoice` (auth'd, mirrors `create-checkout` validation and pricing logic exactly), `invoice-pdf` (renders PDF), `confirm-invoice-payment` (public, token-gated), plus an `expire-invoices` cron job.
- PDF rendered in Deno with a lightweight PDF library; email attachment routed through the existing `send-transactional-email` infrastructure on `notify.altowhisky.com`.
- Discount code redemption for bank transfer is deferred until the invoice is marked **Paid**, matching current Stripe behaviour.

## Needed from you before it can go live

- Company bank details (account name, sort code, account number, IBAN/BIC, bank name).
- Registered company name, address and company number for the invoice header.

I'll build with clearly-marked placeholders and swap in the real values as soon as you send them.
