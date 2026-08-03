# Invoice footer: remove disclaimer and add telephone number

Update the shared invoice PDF template so the letterhead footer no longer shows the investment-risk disclaimer and displays the company telephone number.

## Changes

1. **Add telephone number** in `supabase/functions/_shared/invoice-config.ts`:
   - Set `telephone` to `"0330 822 4189"`.

2. **Remove disclaimer sentence** in `supabase/functions/_shared/invoice-pdf.ts`:
   - Remove the row `"Cask whisky is an unregulated asset; values can fall as well as rise."` from the `drawLetterheadFooter` rows array.
   - The footer will then show: company name + address on one line, website · Tel 0330 822 4189 · email on the second line, with the copper bar at the bottom.

3. **Regenerate Huw Owen's paid invoice** as a throwaway PDF to verify the footer renders correctly and the telephone number is included. Deliver it as a downloadable artifact.

4. **Redeploy the invoice Edge Functions** (`create-invoice`, `invoice-access`, `payments-webhook`) so live invoices use the updated footer.

## Technical notes

- The footer is already fixed at the bottom of the A4 page; removing one row will slightly shorten the block, so the copper bar stays flush at the bottom edge.
- No other invoice content or pricing logic changes.
