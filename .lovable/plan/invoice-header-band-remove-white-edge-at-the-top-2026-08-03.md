# Invoice header band — remove white edge at the top

## Goal
The navy header band on the invoice PDF should run edge to edge with no white sliver visible along the top or the left of the page.

## What to change
In the shared invoice PDF template:

- Draw the navy header band with a small overshoot beyond the page edges (start slightly left of x=0 and extend above the page top) instead of exactly at the page boundary. This removes the hairline white edge that some PDF viewers render at the page margin.
- Apply the same overshoot to the copper hairline directly under the band so it stays flush left and right.
- Leave the logo, "INVOICE" title and all other content positions unchanged — only the background rectangles change.

## Verification
- Regenerate Mr Huw Owen's paid invoice from the updated template.
- Render page 1 to an image at high resolution and inspect the top-left corner specifically, confirming no white strip along the top or left edge, and that the rest of the layout (footer with telephone number, PAID IN FULL box) is unaffected.
- Redeploy the invoice-related edge functions so live invoices use the same header.

## Technical detail
File: `supabase/functions/_shared/invoice-pdf.ts` — the two `page.drawRectangle` calls that paint the header band and the copper hairline. Extend width and height a few points past the A4 bounds (`x: -4`, `width: W + 8`, band top above 841.89) so anti-aliasing at the page edge cannot expose white.

Functions to redeploy: `create-invoice`, `invoice-access`, `payments-webhook`.
