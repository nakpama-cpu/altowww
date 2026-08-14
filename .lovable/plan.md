# White filter boxes — My Orders

The search, date, amount and cask-filter inputs on the portal's My Orders page still render with the cream page colour instead of white. The selects and Clear button already use the white surface.

## Cause

The shared input component applies a `bg-background` utility (cream). Tailwind utilities beat the `.field-surface` component-layer rule, so the background token from `field-surface` never takes effect on `<Input>` elements.

## Change

- On every filter control in `src/pages/portal/Orders.tsx`, add the `bg-surface` utility alongside `field-surface` so the white surface token wins over the base input background.
- Apply to: search, date from, date to, min amount, max amount, cask detail filter, and confirm payment-method select, status select, sort select and Clear button also read as pure white.
- Remove the redundant `border-border` duplication where `field-surface` already sets the border, keeping borders, 40px height, square corners and focus ring unchanged.

## Verification

An agent will load the portal My Orders page in the running preview, read the computed background colour of each of the ten controls, and confirm every one is `rgb(255, 255, 255)` before the task is reported complete.

## Out of scope

Order cards, invoice views, and other portal pages.
