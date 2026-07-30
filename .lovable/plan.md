## Goal
Apply the "Premium Glass Stack" visual language (already used for the stack edges and page-turn) to the cask card itself, so single cards and stacked cards share one refined aesthetic.

## Scope
Presentation only in `src/pages/portal/MyCasks.tsx` (`CaskCard`, `SpecBox`, and the stack navigation bar). No data, query, or logic changes.

## Card surface
- Replace the flat `bg-muted/20` panel with a frosted-glass surface: layered translucent background (`bg-surface/70` + `backdrop-blur-md`), hairline border, and a soft elevated shadow.
- Keep the region-coloured left rule but soften it into a gradient edge that fades down the card, plus a faint region-tinted glow in the top-left corner.
- Slightly larger corner treatment consistent with the portal (subtle, still squared-off — no rounded pill look).

## Header
- Cask number as small copper-tinted uppercase eyebrow with a thin divider.
- Distillery name in Cormorant display at a larger size, tighter leading.
- "View Certificate" becomes a ghost glass button (translucent background, hairline border, copper text on hover) aligned right.

## Maturation bar
- Track becomes a translucent inset rail; fill gets a subtle gradient from the region colour to copper with a soft glow at the leading edge.
- Label row keeps the same copy and percentages.

## Spec grid
- `SpecBox` restyled as frosted glass tiles: translucent background, hairline border, no heavy shadow, hover lift with slightly brighter surface.
- Labels in finer letterspaced micro-caps at reduced opacity; values in medium weight.
- Same fields and same 2/3/4-column responsive grid, uniform min-height retained.

## Stack chrome
- Navigation bar under the card adopts the same glass treatment so it reads as part of the card, with copper active dot indicators and the existing counter/hint text.

## Verification
Screenshot `/portal/my-casks` (single card and a stacked group) at desktop and mobile widths to confirm alignment, contrast, and that the flip animation still reads cleanly against the new surface.
