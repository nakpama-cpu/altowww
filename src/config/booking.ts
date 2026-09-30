/** Public GoHighLevel calendar URL. This must be an embeddable public URL, never an API credential. */
const DEFAULT_GHL_PUBLIC_CALENDAR_URL =
  "https://api.leadconnectorhq.com/widget/booking/XszmpWdESN9t1YBKvA1L";

export const GHL_PUBLIC_CALENDAR_URL = (
  import.meta.env.VITE_GHL_PUBLIC_CALENDAR_URL || DEFAULT_GHL_PUBLIC_CALENDAR_URL
).trim();