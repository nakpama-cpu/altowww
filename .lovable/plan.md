# GoHighLevel CRM Integration + Meta Ad Landing Pages

## What you asked for
- Connect the website to GoHighLevel (GHL) as the CRM.
- Build landing pages for Meta (Facebook/Instagram) ads as part of the lead funnel.
- Every new **lead** (brochure requests, contact form) and every new **portal signup** flows into GHL as a contact.
- The existing email notification to nick@altowhisky.com **stays on** — GHL is added alongside, not replacing it.

## Can both be on altowhisky.com?
Yes. The main site keeps altowhisky.com and www.altowhisky.com. GHL landing pages can be hosted on a subdomain you own (e.g. `go.altowhisky.com`) — a single DNS record points it at GHL, and GHL serves its pages there with its own SSL. Both live under one brand.

## Recommendation for landing pages
Build the first ad landing pages **on your Lovable site** (e.g. `/invest`, `/request-brochure` style offer pages):
- They inherit your exact design (fonts, cream/navy/copper), the Meta Pixel already installed, and rank on your domain for SEO.
- Their form submissions flow into GHL automatically via the integration below.
- GHL still runs all the automation: pipelines, SMS/email follow-up, appointment booking.
- If you later want to drag-and-drop quick test pages inside GHL, they can live on `go.altowhisky.com` — both feed the same GHL pipeline.

## Part 1 — GHL integration (the plumbing)
1. In GHL you create an **Inbound Webhook** trigger inside a workflow; GHL gives you a private webhook URL.
2. The site gains a small server function that, whenever a lead or portal signup happens, POSTs name, email, phone, message, and source to that URL. GHL turns the payload into a contact and starts your funnel.
3. The webhook URL is stored as a secret (never in the code). If GHL is ever unreachable, the lead is still saved in your database and the email to you still sends — nothing is lost.
4. Flows covered:
   - Brochure request (site modal) → GHL contact + "Brochure Request" tag/source
   - Contact page enquiry → GHL contact + "Website Enquiry" tag/source
   - New portal signup → GHL contact + "Portal Signup" tag/source
5. Duplicate protection: GHL matches on email address, so the same person isn't created twice.

## Part 2 — First Meta ad landing page (the funnel front)
1. A dedicated, focused landing page on the main site — short pitch, social proof, one clear form (name, email, phone), consistent with the brand narrative pages.
2. The Meta Pixel is already on the site; the page adds a **Lead** event on form submit so Meta can optimise delivery toward real enquiries.
3. GHL's own Meta integration handles ad-to-CRM attribution on its side.
4. Once the funnel is running, more offer pages can be cloned from this template quickly.

## What you do in GHL (not code)
- Create the workflow with the Inbound Webhook trigger and copy the URL to me.
- Build your pipelines/automations for what happens after a lead lands.
- Connect GHL to your Facebook/Instagram pages (done in GHL settings).

## Technical notes
- New edge function `push-to-ghl` reading `GHL_INBOUND_WEBHOOK_URL` from secrets; called fire-and-forget with error logging so lead capture never blocks or fails because of the CRM push.
- Triggered from: `BrochureModal.tsx` and `Contact.tsx` lead inserts (server-side path via existing lead flow) and `notify-new-signup` (signup flow), keeping all sends server-side.
- Secret added via the secrets manager; no webhook URL in client code.
- Meta `Lead` event added to the landing page form submit alongside the existing pixel.
- Deploy the new function, verify with a test lead end-to-end (site → database → GHL webhook receipt → email still sending).

## Out of scope for this pass
- Building additional ad-variant pages (clone from the first one later).
- Pointing a `go.` subdomain at GHL (only needed if/when you build pages inside GHL — a DNS record you add in your domain settings).
