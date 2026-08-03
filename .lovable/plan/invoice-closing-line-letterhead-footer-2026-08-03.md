# Invoice closing line + letterhead footer

Two changes to the shared invoice PDF template, then Huw Owen's paid invoice is regenerated with the same layout.

## Changes

1. **Closing sentence** — replace "Thank you for your purchase. Your ownership certificates will follow once the casks are regauged and numbered." with:
   "Thank you for your purchase. Your ownership certificates will follow."

2. **A4 letterhead footer, fixed at the page bottom** — a proper company footer block anchored just above the copper bar on every page, independent of how long the invoice content is. It shows, on a thin rule-separated band:
   - Alto Whisky · 71-75 Shelton Street, London, United Kingdom, WC2H 9JQ
   - www.altowhisky.com · accounts@altowhisky.com
   - Existing risk line: "Cask whisky is an unregulated asset; values can fall as well as rise."

   Set in small grey type, centred/justified to the same slim A4 margin as the rest of the page, with the copper bar kept flush to the bottom edge.

   No telephone number is included since none was supplied — tell me the number and I'll add it to the footer line.

## Technical notes

- `supabase/functions/_shared/invoice-pdf.ts` — closing text change; footer drawn at fixed y-coordinates above the copper bar, with a hairline separator and multi-line company block.
- `supabase/functions/_shared/invoice-config.ts` — add an optional `telephone` field (blank for now) so the footer picks it up automatically once provided.
- Redeploy `create-invoice`, `invoice-access`, `payments-webhook` so live invoices use the new template.
- Regenerate Huw's PDF via a throwaway script (no DB rows, no email), delivered as a download and visually QA'd page by page.
