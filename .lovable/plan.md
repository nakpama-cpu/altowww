# Stacked "book pages" cask cards in My Casks

## Goal
In the portal's My Casks card view, casks that are identical except for their cask number appear as a stack of individual cards — rendered like pages in a book, one on top of the other — with navigation to flick through each record.

## Behaviour
- Casks with matching details (distillery, spirit/spirit name, cask type, size, wood, fill date, ABV, age, RLA/OLA, purchase price, purchase date) form a stack. Each cask keeps its own full card — nothing is merged into a combined card.
- Visual: the front card sits flush; the cards behind it peek out slightly (a few px offset down and to the side, scaled down, reduced opacity) so the stack reads as a pile of pages. Depth is capped at ~3 visible edges regardless of stack size.
- Turning a page: prev/next arrow buttons sit at the bottom of the front card, with a `2 / 5` counter and small dot indicators. Left/right arrow keys work when the stack is focused.
- Page-turn animation: the outgoing card lifts and slides off with a slight rotation while the next card scales up into place (~300ms, respects `prefers-reduced-motion` by cross-fading instead).
- Each card retains its own cask number, certificate button, maturation bar, and full spec grid, exactly as today.
- Single casks render as a plain card with no stack edges, counter, or arrows.
- Search and sort still operate on individual holdings; stacks are formed after filtering/sorting and positioned at their first matching member. Searching a specific cask number opens that stack on the matching card.
- Table view is unchanged (one row per cask).

## Technical notes
- All changes stay in `src/pages/portal/MyCasks.tsx`; no backend or database changes.
- Extract the existing card markup into a `CaskCard` component in the same file (props: the holding row, `openCert`, `loadingCert`) so it can be reused for each page of a stack.
- Add a `stacks` memo over `filtered` that keys holdings by a normalised signature of the shared spec fields and returns `{ key, units: Row[] }`.
- Add a new `CaskStack` component holding the active index state, arrows, counter, dots, and the absolutely-positioned background card edges.
- Use Tailwind transforms/transitions for the offset and page-turn; no new dependencies.
