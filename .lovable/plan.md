## Goal
Keep the "More Info" modal on Available Stock as a compact floating popup on every screen size — never edge-to-edge, never full height.

## Change
In `src/pages/portal/AvailableStock.tsx`, update the `DialogContent` className:

- Add `max-h-[85vh]` and `overflow-hidden` to the outer container
- Add mobile-safe width: `w-[calc(100%-2rem)]` so it floats with margin on small screens (shadcn default goes near edge-to-edge on mobile)
- Keep existing `max-w-2xl`
- Inner scroll area: reduce `max-h-[55vh]` to `max-h-[50vh]` so header + image + padding + scroll body all fit within 85vh on short viewports

Result: modal always appears as a floating card with visible space above, below, and (on mobile) on the sides; long content scrolls inside.

## Out of scope
No changes to layout, content, fields, or styling beyond the dialog sizing.