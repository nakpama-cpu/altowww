# Invoice PDF: footer legal line + header block restyle

## 1. Footer legal entity line
Add to the letterhead footer at the bottom of every invoice PDF:

"Alto Whisky is a trading name of Alto Asset Management Ltd. Company No. 1430237"

It sits with the existing centred footer rows (address line, then website / telephone / email), above the copper bottom bar.

## 2. Header top-right block
Replace the current right-hand header text ("INVOICE" in copper over the grey "CASK WHISKY PORTFOLIOS" strapline) with the same treatment used in the on-screen invoice preview:

```text
                INVOICE      <- small, copper, uppercase, wide letter-spacing
              AW-2026-0052    <- larger, white, serif display style
```

- Line 1: "INVOICE", small caps size, copper, letter-spaced.
- Line 2: the invoice number, larger, white.
- Both right-aligned inside the navy header band, vertically balanced against the enlarged logo.

## Technical notes
- `supabase/functions/_shared/invoice-config.ts`: set `companyNumber` and add the trading-name/legal text used by the footer.
- `supabase/functions/_shared/invoice-pdf.ts`: add the legal row in `drawLetterheadFooter`; rewrite the top-right header text block (copper label + white invoice number, right-aligned, letter-spacing emulated by manual character spacing since Helvetica has no tracking).
- Redeploy `create-invoice`, `invoice-access`, `payments-webhook`.
- Regenerate Mr. Huw Owen's AW-2026-0052 PDF for review.
