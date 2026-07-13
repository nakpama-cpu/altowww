# Plan: Connect Squarespace domain to Lovable

## Goal
Point a Squarespace-registered domain to the published Lovable site so both `yourdomain.com` and `www.yourdomain.com` resolve correctly.

## Steps

1. **Publish the Lovable site**
   - A custom domain can only be connected after the site is published.
   - Current project is already published at `https://altowww.lovable.app`, so this prerequisite is met.

2. **Start domain setup in Lovable**
   - Go to **Project Settings → Project → Domains** (desktop) or **... → Settings → Project → Domains** (mobile).
   - Click **Connect Domain**.
   - Add `yourdomain.com` as one entry.
   - Add `www.yourdomain.com` as a second entry (www must be added explicitly).
   - Lovable will display the required DNS records, including a unique `_lovable` TXT verification value.

3. **Configure DNS in Squarespace**
   - Log in to Squarespace and open the domain's DNS settings.
   - Add or update the following records:
     - **A record** — Host: `@` — Value: `185.158.133.1`
     - **A record** — Host: `www` — Value: `185.158.133.1`
     - **TXT record** — Host: `_lovable` — Value: `lovable_verify=…` (copy the exact value from Lovable)
   - Remove or update any conflicting A records for `@` or `www` that point elsewhere.

4. **Wait and verify**
   - DNS propagation can take up to 72 hours, though it often completes sooner.
   - Lovable will automatically verify ownership and provision SSL once the records are detected.
   - Check domain status in **Project Settings → Domains**; it should move from Verifying → Active.

## Notes
- Squarespace manages DNS for domains registered through them, so the records are added in your Squarespace account.
- Use only the A-record values Lovable provides; do not switch to CNAMEs unless Lovable instructs you to (e.g., for a proxy like Cloudflare).
- If a CAA record exists, ensure it allows Let's Encrypt so SSL can be issued.

## No code changes required
This is a DNS and project-settings task only.