## Goal
Rebrand the portal signup page (`/portal/signup`) — the destination of the "Access the Client Portal" link in the launch email — so it matches the cinematic marketing theme and includes the main-site navigation. Apply the same treatment to the sibling auth pages so the flow feels consistent.

## Scope
Redesign these four pages using the marketing design system (cream/dark blue sections, copper accents, Cormorant Garamond headings, Inter body, generous vertical rhythm):
- `src/pages/portal/Signup.tsx` (primary — linked from the email)
- `src/pages/portal/Login.tsx`
- `src/pages/portal/ForgotPassword.tsx`
- `src/pages/portal/ResetPassword.tsx`

No functional/auth changes — only presentation.

## Design approach
- **Top navigation:** Reuse the marketing `Header` component so users get the full nav (How It Works, Why Whisky, About Whisky, News, Contact, Sign In, Request Brochure) on these pages.
- **Backdrop:** Dark-blue section background with a subtle whisky/cask hero image (reuse an existing marketing image asset) at low opacity for cinematic depth, matching the alternating cream/dark-blue theme.
- **Card:** Cream-surfaced form card, centered, with a thin copper divider under the heading. Copper accent on the primary CTA and inline links.
- **Typography:** Cormorant Garamond display heading ("Create your Alto Whisky account" / "Sign in"), Inter labels in uppercase tracked style (already used) — kept but re-tokenised through the marketing palette.
- **Footer:** Add the standard marketing footer (with FCA/compliance disclaimers) below the card so the page reads as part of the site, not a detached form.
- **Responsiveness:** Header clearance margin at top (matches marketing hero rule); form card stays centered on mobile with reduced padding.

## Out of scope
- No changes to auth logic, form fields, validation, redirects, or Supabase calls.
- No changes to the authenticated portal shell (`PortalLayout`, Dashboard, etc.) — those already have their own portal chrome.
- No changes to the email template.

## Technical notes
- Import and render `<Header />` (from `src/components/Header.tsx`) and the marketing `Footer` at the top/bottom of each auth page, wrapping the existing form markup in a themed section.
- Use existing semantic tokens (`bg-background`, `bg-card`, `text-primary`, copper accent classes already defined in `index.css`) — no hardcoded colors.
- Reuse an existing hero/backdrop image from `src/assets/` rather than generating a new one.
- Keep the `LoginModal` behavior on the header intact; a user landing on `/portal/signup` who clicks "Sign In" in the header will still get the modal as designed.