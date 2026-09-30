# Alto Whisky Book a Call Page

## What will be built
- Add a dedicated public page at `/book-a-call`, designed as a focused continuation of the Alto Whisky investment guide.
- Use a restrained logo-only header and compact regulatory footer so visitors stay focused on booking; no links or calls-to-action elsewhere on the site will change.
- On desktop, place the introduction and “What we can discuss” list on the left, with a prominent white booking panel on the right.
- On mobile, stack the introduction first and the booking panel second with comfortable spacing and no horizontal overflow.
- Use the supplied UK English wording exactly, including all three discussion points and the booking-panel copy.

## Calendar behaviour
- No unambiguous GoHighLevel public calendar URL exists in the current project.
- Add one clearly named public configuration value for the GoHighLevel calendar URL, initially empty.
- While empty, show the honest message: “Online booking will be available here shortly.”
- Once the value is configured, show the official calendar in a responsive, accessible iframe with ample height and a direct “Open booking calendar” fallback link.
- Do not add credentials, invent availability, or fabricate a booking URL, times, confirmations, or claims.

## Metadata and discovery
- Add the route-specific page title, description, canonical URL, and social metadata for `https://www.altowhisky.com/book-a-call`.
- Add the public page to the generated sitemap without adding it to global navigation.

## Technical details
- Create a focused `BookACall` page and a small booking configuration module.
- Register the route in the existing React router.
- Reuse the existing Alto logo, Cormorant Garamond and Inter typography, semantic navy/cream/copper tokens, spacing rhythm, and footer risk wording.
- Record the public calendar configuration convention in the project’s technical guidance.

## Checks
- Confirm the page loads directly at `/book-a-call`.
- Check desktop at 1280px and mobile at 390px for layout, text fit, and the empty calendar state.
- Confirm route metadata and canonical URL update correctly.
- Confirm the generated sitemap includes the page.
- Check the latest preview build and browser console for errors.
- Do not publish or deploy.
