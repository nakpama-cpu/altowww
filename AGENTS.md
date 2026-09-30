# Project Architecture

- Use the supplied public GoHighLevel calendar as the booking iframe default while allowing `VITE_GHL_PUBLIC_CALENDAR_URL` to override it; public embed URLs only, never credentials.
- Keep the GoHighLevel booking iframe inside the `/book-a-call` modal so the public page remains a focused, branded introduction.