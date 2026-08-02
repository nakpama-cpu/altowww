Implement the selected "Premium Glass Stack" transition for duplicate casks in `src/pages/portal/MyCasks.tsx`, adapting the frosted-glass depth language to the portal's existing light cream / navy / copper palette.

## What will change

1. **Stack depth edges** — Replace the current flat offset rectangles behind the front card with translucent, frosted-glass-style layers:
   - Back-most edge: soft blur, muted border, lower opacity, larger Y offset and scale.
   - Middle edge: light backdrop-blur, thin border, moderate opacity, smaller offset.
   - Front card stays crisp and opaque with a subtle shadow.

2. **Page-turn / swipe transition** — Keep the existing swipe, arrow, and keyboard navigation, but refine the motion:
   - Use a cubic-bezier `[0.23, 1, 0.32, 1]` ease-out curve.
   - Add a slight lift (`translateY`) and scale change during the drag so the card feels physically separated from the stack.
   - Fade the outgoing card with a soft rotation rather than the current linear slide.

3. **Swipe hint** — Add a small dot/page indicator under the stack that matches the existing card's regional accent color (copper tones), consistent with the current navigation bar but lighter.

4. **Color adaptation** — Use the portal's existing semantic tokens (`bg-muted/20`, `border-border`, `bg-surface`, `text-muted-foreground`, regional accent) so the glass effect works in light mode and stays consistent with the rest of the site.

5. **Accessibility** — Maintain `prefers-reduced-motion` cross-fade fallback and keep keyboard arrow navigation.

## What will NOT change
- Card content, spec grid, certificate button, maturation bar, or single-cask behavior.
- Table view.
- Search/sort/filter logic or stack grouping.

## Verification
- Open the portal My Casks page for the test user.
- Confirm stacked casks show the new frosted depth edges and refined swipe/turn animation.
- Confirm single casks remain a plain card with no stack UI.
- Confirm reduced-motion still cross-fades cleanly.

Only `src/pages/portal/MyCasks.tsx` will be edited.