# KYC: Address & Age Verification

Manual admin review, no paid third-party services. All users (UK + international). Verification must be complete before checkout.

## Data model

Extend `profiles`:
- `date_of_birth` (date, nullable)
- `address_line1`, `address_line2`, `address_city`, `address_region`, `address_postcode`, `address_country` (text)
- `proof_of_address_path` (text) — storage path
- `proof_of_address_type` (enum: `utility_bill`, `bank_statement`, `driving_licence`, `council_tax`, `other`)
- `proof_of_address_issued_on` (date) — user attests document date; admin verifies within 3 months
- `proof_of_age_path` (text)
- `proof_of_age_type` (enum: `passport`, `driving_licence`, `national_id`)
- `address_verified_at` (timestamptz, nullable) — set by admin
- `age_verified_at` (timestamptz, nullable) — set by admin
- `verification_notes` (text) — admin-only rejection notes
- `verification_status` (enum: `not_submitted`, `pending`, `verified`, `rejected`) — derived convenience field maintained by trigger

RLS: user can read/update own row (existing `prevent_profile_escalation` trigger already blocks changes to sensitive fields; extend it to also block `address_verified_at`, `age_verified_at`, `verification_status`). Only admins can set verified/rejected fields.

## Storage

New private bucket `kyc-documents`. Path scheme: `{user_id}/address-{timestamp}.{ext}` and `{user_id}/age-{timestamp}.{ext}`.

RLS on `storage.objects`:
- Users can INSERT/SELECT/DELETE their own files (path starts with their uid).
- Admins can SELECT all.

## Frontend — Account page (`src/pages/portal/Account.tsx`)

Add two new cards below Profile:

**1. Address**
- Country selector (reuse `CountrySelect`).
- Manual address fields for everyone: line 1, line 2, city, region/state, postcode.
- No postcode-lookup API (free options are unreliable/rate-limited; skip for now — can add later).
- Proof of address upload: document type dropdown, issue date picker, file input (PDF/JPG/PNG, max 10MB).
- Status badge: Not submitted / Pending review / Verified / Rejected (with admin note).

**2. Date of Birth & ID**
- DOB date picker (must be 18+).
- Proof of age upload: document type dropdown, file input.
- Note beside driving-licence option: "If you upload a UK driving licence here and select it for address proof too, one document covers both."
- If user picks driving licence for *both*, allow single file upload used for both records.
- Status badge like above.

Fields become read-only once `verification_status = pending` or `verified`; editable again if `rejected`.

## Checkout gate

In `src/pages/portal/Checkout.tsx`: if `profile.address_verified_at` or `profile.age_verified_at` is null, block submit and show a banner linking to Account with "Complete verification to purchase". No blocking elsewhere in portal.

## Admin — new Verifications page (`src/pages/admin/Verifications.tsx`)

Route: `/admin/verifications`. Added to `AdminLayout` nav.

- Queue of profiles with `verification_status = pending`.
- Per-row: name, email, DOB, address, both document previews (signed URLs from `kyc-documents`), document types, issue date.
- Actions per document: **Approve address**, **Approve age**, **Reject** (with note). Approve buttons stamp `address_verified_at` / `age_verified_at`.
- Separate tab for already-verified and rejected users for reference.

## Technical details

- Migration adds the columns, enums, storage bucket, RLS policies, and updates `prevent_profile_escalation` trigger.
- Admin approval writes via service-role (edge function `verify-client-kyc`) so client-side RLS stays tight and we can send an email notification on approve/reject reusing the existing transactional-email infrastructure.
- New transactional templates: `kyc-approved`, `kyc-rejected` (with reason).
- Signed URLs for document previews generated on demand in admin page (60s expiry).

## Out of scope (for later)

- Automated postcode → address lookup (revisit when you're happy paying for a provider like getAddress.io ~£0.01/lookup).
- Automated ID verification (Onfido/Stripe Identity etc.).
