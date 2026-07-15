# Add Client Title (Mr / Mrs / …) to Signup

## What the user sees

- A new **Title** dropdown appears as the first field in both signup forms (the `/portal/signup` page and the sign-in modal's signup tab). Required.
- Options: Mr, Mrs, Miss, Ms, Mx, Dr, Prof, Sir, Dame, Lady, Lord, Other.
- The saved title shows on the Account page (editable) and next to the client's name in the Admin → Clients list.
- The title is included in the "new signup" admin notification email so you see it at a glance.

## Database

- Add a nullable `title` text column to `profiles` (short length limit, e.g. 20 chars).
- Update the `handle_new_user` trigger to copy `raw_user_meta_data->>'title'` into the new profile row alongside the other fields.
- Existing clients keep `title = null` — no backfill needed.

## Frontend changes

- New reusable `TitleSelect` component (same visual style as the other auth fields).
- `src/pages/portal/Signup.tsx`: add `title` to form state, pass it in `options.data`, render the dropdown at the top of the form.
- `src/components/LoginModal.tsx`: same additions to the signup tab.
- `src/pages/portal/Account.tsx`: add title to the editable profile form.
- `src/pages/admin/Clients.tsx`: show the title in front of first/last name.

## Notification email

- `notify-new-signup` (or the transactional template it renders) currently gets name + email; add title to the payload/template so admin sees "Mr John Smith" instead of "John Smith".

## Types / auth context

- Add `title: string | null` to the `Profile` type in `AuthContext.tsx` so the new field is available app-wide.
- Regenerated Supabase types (automatic after migration) will pick up the column.

## Out of scope

- No changes to lead capture / brochure / callback forms — this is signup only, matching the request.
- No historical backfill or forced re-collection from existing clients.
