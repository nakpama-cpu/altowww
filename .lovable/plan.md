Plan: Unify the client portal around a frosted-glass card system

### Summary
Take the glass treatment already used in My Casks and make it the standard surface language for all portal pages. The goal is a consistent, premium feel without changing any content, layout, typography, or interactions.

### What will change

1. Create a reusable glass-card system in `src/index.css`
   - Add a new component layer with three classes:
     - `.glass-card` — translucent white surface, medium blur, soft border, and a tokenized shadow.
     - `.glass-card-sm` — lighter variant for nested panels, filter inputs, and form sections.
     - `.glass-card-dark` — dark translucent variant for the Dashboard hero / portfolio-value card.
   - Shadows will use semantic tokens (`--foreground` / `--secondary-foreground`) instead of hardcoded black.

2. Set the portal backdrop in `src/pages/portal/PortalLayout.tsx`
   - Switch the main content area from `bg-white` to `bg-background` (warm cream).
   - This makes the glass translucency visible and aligns the portal with the brand palette.

3. Apply glass cards to each portal page
   - `src/pages/portal/MyCasks.tsx` — refactor existing inline frosted classes to use `.glass-card` / `.glass-card-sm` for the main card, SpecBox tiles, and certificate button. Keep the region gradient edge and glow.
   - `src/pages/portal/Dashboard.tsx` — hero card uses `.glass-card-dark`; QuickAction cards use `.glass-card-sm`; `ActivityFeed` uses `.glass-card`.
   - `src/components/portal/ActivityFeed.tsx` — root aside uses `.glass-card`.
   - `src/pages/portal/AvailableStock.tsx` — listing cards, table container, empty states, and filter inputs use `.glass-card` / `.glass-card-sm`.
   - `src/pages/portal/Account.tsx` — profile section, verification dialog content, and dialog form panels use `.glass-card` / `.glass-card-sm`.
   - `src/pages/portal/Orders.tsx` — order cards, filter bar, and empty states use `.glass-card` / `.glass-card-sm`.
   - `src/pages/portal/Checkout.tsx` — cart items, order summary, empty cart, invoice loading/error panels, and order-review aside use `.glass-card` / `.glass-card-sm`.
   - `src/pages/portal/RequestCallback.tsx` — callback form uses `.glass-card`.

4. Leave these unchanged
   - The dark sidebar (solid anchor), mobile header, and Stripe Embedded Checkout iframe container.
   - Marketing-site pages, public header, and footer.
   - All content, copy, spacing, responsive layout, and click/keyboard behavior.

### Verification
- Run the type check after edits.
- Capture screenshots of Dashboard, My Casks, Available Stock, Account, Orders, Checkout, and Request Callback at desktop and mobile widths.
- Check that text contrast remains readable on both light and dark glass surfaces.
