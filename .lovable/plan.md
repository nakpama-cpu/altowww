# Brilliant white search & filter boxes — Available Stock

Restyle the filter row on the portal's Available Stock page so every control sits on a solid, brilliant white surface instead of the translucent frosted glass currently used.

## Scope

All controls in the filter row:
- Search input (with suggestions dropdown)
- Distillery select
- Sort select
- Min price / Max price inputs
- Reset button
- Cards/Table view toggle

## Changes

- Replace the `glass-card-sm` utility on these controls with a solid white surface, keeping the existing thin border, square corners, 40px height, and focus ring.
- Add a small reusable token/utility (e.g. `.field-surface` in `src/index.css`) backed by the existing `--surface` token (pure white) so the look stays in the design system rather than hardcoded colours.
- Keep the suggestions dropdown consistent: solid white panel with the same border and a soft shadow so it reads clearly over the page.
- Slight shadow/hover polish so the white boxes still feel elevated against the cream page background.

## Out of scope

Cask cards, table rows, dialogs, and everything else on the page stay as they are.

## Technical notes

- Work is confined to `src/pages/portal/AvailableStock.tsx` and a small addition to `src/index.css`.
- No hardcoded colour utilities; the new class uses `hsl(var(--surface))`.
- A subagent will carry out the restyle and verify it visually in the running preview.
