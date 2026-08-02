# One-off paid invoice PDF — Mr Huw Owen

Generate a single invoice PDF, identical in branding to the portal invoices, delivered here as a downloadable file. Nothing is emailed, no client portal record is created, and no database rows are added.

## Invoice content

- Invoice number: AW-2026-0052
- Payment reference: AW260052
- Invoice date: 31 July 2026 — marked PAID (paid 31 July 2026 by bank transfer)
- Bill to: Mr Huw Owen, Tan Y Bryn, Pwllheli, Gwynedd, LL53 8NB
- Line item: Glen Ord — Hogshead, Ex-Macallan Sherry, 62.0% ABV, 2026 — quantity 6
- List price GBP 3,300.00 per cask, subtotal GBP 19,800.00
- Pallet discount −GBP 2,700.00, total GBP 17,100.00
- Because the invoice is settled, the bank-transfer block is replaced with a PAID stamp and a "Paid by bank transfer, 31 July 2026" confirmation line; the payment reference is still shown for the client's records.

## Notes to confirm on delivery

- Huw's email address wasn't supplied, so the bill-to block will show his name and postal address only. If you want his email printed, tell me and I'll regenerate.
- The company bank details in the invoice template are still placeholders. On a PAID invoice these aren't needed, so I'll omit that block entirely rather than print placeholders.

## Technical approach

Run a throwaway script (not added to the project) that reuses the same layout, typography, navy/copper palette and Alto Whisky logo as `supabase/functions/_shared/invoice-pdf.ts`, with a PAID variant of the payment block. Output written to `/mnt/documents/AW-2026-0052-huw-owen.pdf` and surfaced as a downloadable artifact. Each page will be rendered to an image and visually checked before delivery.

No changes to project source, database, or the email system.
