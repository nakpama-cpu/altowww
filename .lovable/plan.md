## Redesign: Portal Account page

Rebuild `src/pages/portal/Account.tsx` as a single Profile card with inline verification actions and modal-driven flows. No database changes — reuse existing KYC schema, storage bucket, and triggers.

### Layout

Single "Profile" card, top-down:

```text
┌─ Profile ─────────────────────── [Verified ✓] (only if both approved) ─┐
│                                                              [Edit]     │
│  Name              Mr John Smith                                        │
│  Date of birth     12 March 1985                    [Verify] / Pending  │
│  Email             john@example.com                                     │
│  Address           12 High St, London, SW1A 1AA     [Verify] / Pending  │
│  Contact number    +44 7700 900123                                      │
└─────────────────────────────────────────────────────────────────────────┘
```

- Top-right **Verified** badge appears only when `address_verification_status = 'verified'` AND `age_verification_status = 'verified'`.
- Per-row status control on Date of birth and Address:
  - `not_submitted` → **Verify** button (opens modal)
  - `pending` → grey "Pending review" pill
  - `verified` → green "Verified" pill
  - `rejected` → red **Resubmit** button + admin note tooltip
- **Edit** button (top-right, next to badge) opens the Edit modal.

### Modals

**1. Verify Address modal**
- Address fields: line 1, line 2, city, region, postcode, country (`CountrySelect`).
- Document type dropdown (utility bill, bank statement, driving licence, council tax, other).
- Issue date picker (attested by user, ≤3 months old).
- File input (PDF/JPG/PNG/WebP, ≤10MB).
- On submit: upload to `kyc-documents/{uid}/address-{ts}.{ext}`, update profile fields + `address_verification_status = 'pending'`, close modal, show confirmation toast: "We'll review your documents within 24 hours." Row switches to "Pending review".

**2. Verify Date of Birth modal**
- DOB date picker (must be 18+).
- Document type dropdown (passport, driving licence, national ID).
- File input.
- **Dual-use rule kept**: if user picks "Driving licence" AND already uploaded a driving licence for address (or uploads one here), a checkbox appears — "Use this document for address proof too" — which mirrors the file/type/issue-date onto the address record and also flips `address_verification_status` to `pending`. Works the other way too: uploading a driving licence in the Address modal offers "Use for age proof too".
- Same "within 24 hours" confirmation toast on submit.

**3. Edit modal** (only address + phone)
- Address fields (same as verify modal) + phone (`PhoneField`).
- Name, title, DOB, email are NOT shown here — they're locked identity fields.
- Saving address changes resets `address_verification_status` back to `'pending'` AND requires a fresh proof of address upload in the same modal (per your answer: re-verification required). If they only edit the phone number, no re-verification is triggered.
- Implementation: modal has two tabs/sections — "Contact number" (phone only, saves immediately) and "Address" (fields + required new proof upload, submits as a re-verification).

### Verified banner

When both verifications approved, show a single top-of-page emerald banner:

```text
✓ Verified account — you're cleared to purchase.
```

Plus the small "Verified" chip in the Profile card header.

### Files touched

- `src/pages/portal/Account.tsx` — full rewrite around the new single-card layout.
- New: `src/components/portal/VerifyAddressModal.tsx`
- New: `src/components/portal/VerifyDobModal.tsx`
- New: `src/components/portal/EditProfileModal.tsx`
- No changes to `AuthContext`, admin Verifications page, checkout gate, database schema, RLS, storage bucket, or triggers — the existing `prevent_profile_escalation` trigger already enforces all the locking rules this design relies on.

### Out of scope

- Postcode autocomplete (still deferred until a paid provider is chosen).
- Automated ID verification.
- Editing name/DOB/email from the client side (permanently locked once age-verified, per existing trigger).
