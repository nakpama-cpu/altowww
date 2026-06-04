## Plan: Distillery info modal on Available Stock cards

### 1. Database
Add two optional text columns to `distilleries`:
- `about` (text) — distillery background/story
- `awards` (text) — awards and accolades (multi-line; one per line)

No RLS changes needed (distilleries are already publicly readable).

### 2. Admin editing
Update `src/pages/admin/Distilleries.tsx` so admins can fill in `about` and `awards` when adding a distillery, and edit them for existing distilleries (inline edit row, save button).

### 3. Client portal — Available Stock card
In `src/pages/portal/AvailableStock.tsx`:
- Fetch `about` and `awards` alongside the existing distillery fields.
- Below the cask description, add a "More Info" button styled to match the existing copper/primary look (small, uppercase, tracking).
- Clicking it opens a centered modal (shadcn `Dialog`) showing:
  - Distillery name as the title
  - Region · Country subtitle
  - "About" paragraph
  - "Awards" list (rendered as bullet list, one per line)
  - Graceful fallback message if no info has been added yet
- Modal styled with site tokens: cream card background, Cormorant Garamond heading, copper accent rule.

### 4. Out of scope
- No changes to the table view, MyCasks page, or buy flow.
- Existing distilleries will show the "no info yet" state until an admin populates them.
