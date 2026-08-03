# Apply the Huw Owen invoice format everywhere

The downloadable PDF for every checkout invoice already comes from the shared template used for Huw Owen's invoice (navy full-bleed header with copper "INVOICE" label and Cormorant invoice number, Cormorant cask titles, two-line description, dual list/discount pricing, letterhead footer). What still differs are the two places that render invoice lines with their own older layout:

- The on-screen invoice preview shown at checkout, in Orders, and on the public invoice link.
- The bank-transfer invoice email sent when an invoice is created.

Both currently show the description as "Distillery" plus a single spec line in the old order ("Cask Type · Wood · 62% ABV · 2026"), and neither shows the QTY / UNIT PRICE / AMOUNT columns the way the PDF does.

## What changes

- Item titles become "Glen Ord New Make Whisky Cask" (under 3 years old) or "Glen Ord Whisky Cask" (3 years or over), exactly as in the PDF.
- Specs render on two lines: `2026 · Sherry Hogshead 250L · ABV 62% Approx`, then `Distilled at Glen Ord Distillery`. Wood, cask type and litres stay coupled in one segment.
- Line pricing mirrors the PDF: QTY, UNIT PRICE and AMOUNT, with the struck-through list price above the copper discounted price when a discount applies.
- The email item block uses the same title, two-line specs and pricing presentation, within the existing branded email styling.

Nothing about totals, payment terms, bank details, stock reservation or the PDF itself changes.

## Technical detail

- Extract the title/spec formatting logic currently inline in `supabase/functions/_shared/invoice-pdf.ts` into a small shared helper so the PDF, the React preview and the email all derive descriptions from one source of truth (a `src/lib` copy mirrors it for the client, since edge `_shared` code is not importable from the app bundle).
- `src/components/invoice/InvoiceView.tsx`: replace the description block and the single "Amount" column with the QTY / UNIT PRICE / AMOUNT layout and dual pricing.
- `supabase/functions/_shared/transactional-email-templates/invoice-bank-transfer.tsx` and the `templateData.items` payload built in `supabase/functions/create-invoice/index.ts`: pass the formatted title, both spec lines, unit price and list price, and render them in the email table.
- Redeploy `create-invoice` (and `invoice-access` if its email payload is touched).
- Verify by opening an existing invoice in the portal preview, previewing the email template, and downloading the PDF to confirm all three read identically.
