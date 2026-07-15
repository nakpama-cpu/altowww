## Goal
Normalize client name and email formatting automatically so records stay consistent regardless of how users type them at signup or when editing their account.

## Formatting rules
- **First name / Last name**: Title Case — first letter of each word uppercase, rest lowercase (e.g. `jOHN` → `John`, `mcdonald` → `Mcdonald`, `mary-jane` → `Mary-Jane`). Applied per word split on spaces and hyphens.
- **Title**: kept as selected from the dropdown (already standardized).
- **Email**: fully lowercased and trimmed.

## Where to apply
Normalize in **both** places so old and new data are covered:

1. **Database (source of truth)** — a trigger on `public.profiles` that runs `BEFORE INSERT OR UPDATE` and rewrites `first_name`, `last_name`, and `email` using the rules above. This guarantees consistency no matter how a row is written (signup trigger, Account page, admin edits).
2. **One-time backfill** — update all existing `profiles` rows so current clients display correctly in the admin Clients list immediately.
3. **Client-side polish** — trim + normalize in `Signup.tsx` and `Account.tsx` before submitting, so the user sees the tidy version instantly (the DB trigger is the safety net).

## Technical detail
- New SQL function `public.normalize_profile_names()` (SECURITY INVOKER, `search_path = public`) using `initcap()`-style logic that also handles hyphenated names, plus `lower(trim(email))`.
- Trigger `profiles_normalize_names` runs `BEFORE INSERT OR UPDATE OF first_name, last_name, email`.
- `handle_new_user()` already inserts into profiles → trigger fires automatically, so no change needed there.
- Small shared helper `src/lib/formatName.ts` used by Signup and Account forms.

## Out of scope
- Titles list (unchanged).
- Phone numbers, country, address fields.
- Historical `orders`, `leads`, `callback_requests` name fields (can be added later if you want).
