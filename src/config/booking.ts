/** Public GoHighLevel calendar URL. This must be an embeddable public URL, never an API credential. */
const DEFAULT_GHL_PUBLIC_CALENDAR_URL =
  "https://api.leadconnectorhq.com/widget/booking/XszmpWdESN9t1YBKvA1L";

const envUrl = (import.meta.env.VITE_GHL_PUBLIC_CALENDAR_URL ?? "").trim();

// Ignore blank or non-https overrides so a bad env value can't blank the calendar.
export const GHL_PUBLIC_CALENDAR_URL = /^https:\/\//.test(envUrl)
  ? envUrl
  : DEFAULT_GHL_PUBLIC_CALENDAR_URL;
