## Goal
Centre-align the text inside the submit buttons in the two verification modals.

## Where
- `src/pages/portal/Account.tsx`
  - `VerifyAddressDialog` submit button (~line 383)
  - `VerifyDobDialog` submit button (~line 541)

## How
Both buttons currently use `inline-flex items-center gap-2`. I will add `justify-center text-center` to their class lists so the text and icon group is centred horizontally and any wrapped text is centre-aligned within the button.

## Out of scope
No other buttons, dialog footers, or logic will be changed.