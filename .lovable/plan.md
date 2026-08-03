# Larger invoice logo + regenerate Huw Owen invoice

## Goal
Keep the current invoice header height exactly as it is, but make the Alto Whisky logo noticeably larger inside it. Then regenerate Mr Huw Owen's paid invoice with this styling, with the letterhead footer pinned to the bottom of the page.

## What changes
- In the shared invoice PDF template, increase the logo size (from 104pt wide to roughly 150pt) while keeping it vertically centred in the existing navy band. Band height, copper hairline, "INVOICE" title and all other content positions stay unchanged.
- Nudge the logo's left position only if the larger mark would crowd the left edge.
- Regenerate Mr Huw Owen's paid invoice (6 casks, pallet discount, PAID IN FULL) from the same template so it matches the uploaded AW-2026-0007 look, including the bottom-anchored footer with address, website, telephone and email plus the copper bottom bar.

## Verification
- Render page 1 of the regenerated PDF at high resolution and confirm the logo is larger, the band height is unchanged, nothing overlaps the "INVOICE" title, and the footer sits at the page bottom.

## Technical detail
- File: `supabase/functions/_shared/invoice-pdf.ts` — the `logoW` constant in the header block.
- Redeploy `create-invoice`, `invoice-access`, `payments-webhook` so live invoices use the larger logo.
- Deliver the regenerated Huw Owen PDF as a downloadable artifact (not emailed, not attached to his portal).
