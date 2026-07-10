## Problem
On tablet (~768–1024px), the desktop header nav in `src/components/Header.tsx` doesn't fit: 7 nav items + Client Login + Request Brochure CTA overflow, causing the logo to disappear, labels to wrap, and the Brochure button to clip off-screen.

## Fix — keep the full horizontal nav, shrink it to fit
All changes in `src/components/Header.tsx` (no other files touched):

1. **Tighten link spacing at tablet, restore at desktop**
   - Nav link/button padding: `px-4 py-2` → `px-2 py-2 lg:px-3 xl:px-4`
   - Nav container gap: `gap-2` → `gap-0 lg:gap-1 xl:gap-2`

2. **Slightly smaller nav typography at tablet**
   - Labels: `text-xs tracking-[0.2em]` → `text-[10px] tracking-[0.15em] lg:text-xs lg:tracking-[0.2em]`
   - Dropdown children keep current sizing.

3. **Compact the Client Login + Brochure CTA at tablet**
   - Client Login button uses the same tightened padding/typography as nav links.
   - Brochure button: `px-4 py-2` → `px-3 py-2 lg:px-4` and inherits the smaller label size at tablet.

4. **Give the nav room by trimming the logo at tablet**
   - Logo: `h-10 md:h-12` → `h-10 md:h-9 lg:h-12` (slightly smaller between 768–1023px so nav has more horizontal room).

5. **Reduce outer container padding at tablet**
   - Header inner wrapper: `px-6` → `px-4 lg:px-6`.

## Result
- Tablet (768–1023px): all 7 links + Client Login + Brochure CTA fit on a single row without wrapping or clipping, logo visible.
- Desktop (≥1024px): visually unchanged (original spacing restored via `lg:`/`xl:` classes).
- Mobile (<768px): unchanged.

No layout or breakpoint switch — the desktop-style nav simply scales down cleanly for tablet.