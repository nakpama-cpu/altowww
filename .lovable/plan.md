## Plan: Branded website-launch announcement email template

### What we'll build

1. **New React Email template** at `supabase/functions/_shared/transactional-email-templates/website-launch-announcement.tsx`
   - Uses the same Alto Whisky design system as the existing transactional emails:
     - Dark blue header (`hsl(220, 26%, 14%)`) with 94px centred logo
     - Cream/white body, Cormorant Garamond headings, Inter body text
     - Copper accent links (`hsl(24, 72%, 40%)`) and CTA buttons
     - Preview text, paragraph spacing, and footer matching current templates
   - Accepts props for personalization:
     - `firstName` — replaces "[First name]"
     - `senderName` — replaces "[Your name]"
     - `siteUrl`, `portalUrl`, `newsUrl` — link destinations
     - `offerExpiry` — date for the 15% offer line
   - Uses the user's exact wording as the email body.

2. **Register the template** in `supabase/functions/_shared/transactional-email-templates/registry.ts` under `website-launch-announcement` with a display name, subject line, and preview data.

3. **Deploy affected Edge Functions**: `send-transactional-email` and `preview-transactional-email` so the template renders in the preview system.

### Important note

This template is intended for **rendering into HTML and copying into a dedicated email-marketing platform** (e.g. Brevo, Mailchimp). Lovable's built-in transactional email system does not support bulk campaign sends or promotional blasts.