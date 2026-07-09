## Goal
On mobile, the homepage currently shows a full-screen hero (`h-screen`), so users only see the mountain image and none of the next section ("The Opportunity"). On tablet/desktop the hero is a fixed `380px`, which lets the following section peek through. We'll bring the mobile behavior in line so a portion of "The Opportunity" is visible on initial load.

## Changes

**`src/components/HeroSection.tsx`**
- Change the fixed hero section height from `h-screen md:h-[380px]` to a shorter mobile height that leaves room for the next section to peek in (e.g. `h-[70vh] md:h-[380px]`).
- Update the matching spacer `<div>` to the same height so layout stays aligned.
- Keep internal padding/margins on the hero copy (`mt-12 md:mt-24`, etc.) intact — only the outer container height changes.

**`src/components/PageHero.tsx`** (used by other pages)
- Leave unchanged unless you also want the other pages' heroes to shrink on mobile. Default: leave as-is so this change only affects the homepage.

## Result
On mobile, users land on the hero taking ~70% of viewport height, with the top of WaterSection / "The Opportunity" visible below — mirroring the tablet/desktop peek-through behavior. Tablet and desktop layouts are unchanged (still `380px`).

## Optional tweak
If 70vh feels too tall or too short after preview, we can dial to `65vh` or `75vh` in one line.
