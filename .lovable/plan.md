# Portal News filter boxes — white backgrounds

The portal News page (`/portal/news`) still uses the translucent `bg-background border-border` styling on its three controls, unlike My Orders and Available Stock which use the solid white `field-surface` utility.

## Change

In `src/pages/portal/PortalNews.tsx`, swap `bg-background border border-border` for `field-surface` on:

- Search articles input
- "All sectors" category select
- Sort select ("Newest first")

Keep padding, focus ring, icons, and layout untouched.

## Verification

An agent will drive the live preview at `/portal/news`, read the computed `background-color` of all three controls, and confirm each returns `rgb(255, 255, 255)` before the task is reported complete.
