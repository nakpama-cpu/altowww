## Goal

Add a new **News & Insights** tab to the fixed header (right after Home) that opens a wide hover-triggered dropdown panel. The panel shows all news articles in a slow-moving carousel, sorted newest-first. Clicking an article navigates to its full article page.

## Placement & Spacing

- Tab order in `Header.tsx`: **Home → News & Insights → How It Works → About Whisky → Why Whisky → Contact**.
- Dropdown is a full-width panel anchored to the header (not a narrow menu under the tab), so it can overlay the hero headline area without covering the CTA buttons.
- Vertical sizing rule: the panel's bottom edge sits above the "Request Brochure / Speak to an Advisor" buttons with the **same gap** currently used between the buttons and the bottom of the hero image (~21px, per the hero spacing we tuned earlier). Same rule applies to the gap between the header's bottom edge and the top of the dropdown panel.
- On desktop, the panel spans the full viewport width with a translucent dark backdrop matching the header (`bg-secondary/95 backdrop-blur-md`).
- On mobile, no hover panel — the tab behaves like a regular link to `/news` (the existing News page), matching current mobile menu patterns.

## Interaction

- **Trigger:** mouse enter on the tab OR the panel keeps it open; mouse leave from both closes it (small ~150ms grace delay to prevent flicker when moving cursor from tab into panel).
- **Keyboard/focus:** focus on the tab also opens it; Escape closes.
- **Click article:** navigates to `/news/:slug` (existing `ArticlePage` route).
- Closing on route change already handled by existing `useEffect` on `location`.

## Carousel

- Uses the existing `articles` array from `src/data/articles.ts`, sorted by date descending (newest first). Dates are stored as human strings ("June 2026") — add a parser or an explicit sort key.
- Slow auto-advance: continuous marquee-style horizontal scroll (CSS `@keyframes` translateX loop), ~40–60s per full cycle. Pauses on hover of a card.
- Shows 3 cards visible at a time on desktop, 2 on tablet. Each card: image thumbnail, category, date, title (compact — this is a dropdown, not a full section).
- Duplicate the article list inline for a seamless infinite loop.

## Files to change

- `src/components/Header.tsx` — add News & Insights entry, add hover state, render new dropdown component, reorder links.
- `src/components/NewsMegaDropdown.tsx` (new) — full-width panel with the marquee carousel and article cards.
- `src/data/articles.ts` — add a `sortDate` (ISO) field or a helper to sort chronologically; keep display `date` unchanged.
- `src/index.css` (or Tailwind config) — add a `marquee` keyframe if not already present.

## Technical notes

- The panel is `position: fixed; top: <header height>; left: 0; right: 0;` so it overlays hero content without shifting layout.
- Height is bounded so the bottom edge lands above the hero CTA buttons. Use a fixed value tuned to the current hero layout (roughly `calc(380px - header - buttons-height - 21px*2)` on desktop; hard-code after measurement).
- Marquee implementation: flex row with `animation: marquee Xs linear infinite`, `width: max-content`, list rendered twice.
- Respect `prefers-reduced-motion`: pause animation.

## Out of scope

- No changes to the `/news` page itself.
- No changes to article content or the mobile menu structure beyond adding the new link.

Confirm and I'll build it.