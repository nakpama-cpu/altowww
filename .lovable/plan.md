The signup title dropdown currently shows the full list (Mr, Mrs, Miss, Ms, Mx, Dr, Prof, Sir, Dame, Lady, Lord, Other). I will keep non-standard titles out of the signup flow while preserving them for account/profile editing where existing user data may rely on them.

### What I will change

1. **`src/components/auth/TitleSelect.tsx`**
   - Keep `TITLE_OPTIONS` as the full list for account/admin use.
   - Add `SIGNUP_TITLE_OPTIONS`: `Mr`, `Mrs`, `Miss`, `Ms`, `Prof`, `Other`.
   - Add an optional `options` prop so callers can choose which list to render.

2. **`src/pages/portal/Signup.tsx`**
   - Pass `SIGNUP_TITLE_OPTIONS` to `<TitleSelect>` so the standalone signup page shows only standard titles.

3. **`src/components/LoginModal.tsx`**
   - Pass `SIGNUP_TITLE_OPTIONS` to the `<TitleSelect>` inside the modal signup tab, matching the standalone page.

4. **Verification**
   - Open the live preview on the signup route and confirm the dropdown contains only: Mr, Mrs, Miss, Ms, Prof, Other.

### Out of scope
- No database changes.
- No changes to the Account page or admin Clients list, so existing profiles with non-standard titles remain intact and editable.