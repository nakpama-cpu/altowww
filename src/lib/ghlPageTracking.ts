import { isAllowedHost, isPublicPath, sanitizeReferrer, sanitizeUrl } from "@/lib/analytics";

const EVENTS_URL = "https://backend.leadconnectorhq.com/external-tracking/events";
const TRACKING_ID = "tk_2751e8cae0ce412dac03062b84744fae";
const SESSION_KEY = "alto_ghl_session_v1";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
let sessionId: string | undefined;
let lastPath: string | undefined;

/** Read only the guide's first-party identity cookie; never copy it into GA/Meta. */
export const readGhlContact = (cookies: string, now = Date.now()): string | undefined => {
  const value = cookies.split(";").map((part) => part.trim())
    .find((part) => part.startsWith("alto_ghl_contact_v1="))?.slice("alto_ghl_contact_v1=".length);
  if (!value) return undefined;
  try {
    const contact: unknown = JSON.parse(decodeURIComponent(value));
    if (!contact || typeof contact !== "object") return undefined;
    const { contactId, expiresAt } = contact as Record<string, unknown>;
    if (typeof contactId === "string" && /^[A-Za-z0-9]{20}$/.test(contactId) &&
      typeof expiresAt === "number" && Number.isFinite(expiresAt) && expiresAt > now) {
      return contactId;
    }
  } catch { /* Invalid cookies are anonymous visits. */ }
  return undefined;
};

const browserSession = (): string => {
  if (sessionId) return sessionId;
  try {
    const stored = window.sessionStorage.getItem(SESSION_KEY);
    if (stored && UUID.test(stored)) sessionId = stored;
  } catch { /* Storage can be unavailable; retain an in-memory session. */ }
  if (!sessionId) sessionId = window.crypto.randomUUID();
  try { window.sessionStorage.setItem(SESSION_KEY, sessionId); } catch { /* No storage required. */ }
  return sessionId;
};

/** Thin native page-event sender, with no vendor script, form observer or replay queue. */
export const trackGhlPageView = (path: string): void => {
  if (typeof window === "undefined" || !isAllowedHost(window.location.hostname) ||
    !isPublicPath(path) || !isPublicPath(window.location.pathname) ||
    path !== window.location.pathname || path === lastPath) return;
  lastPath = path;
  try {
    const contactId = readGhlContact(document.cookie);
    const userAgent = window.navigator.userAgent;
    const payload = {
      type: "external_script_page_view",
      trackingId: TRACKING_ID,
      sessionId: browserSession(),
      ...(contactId ? { contactId } : {}),
      timestamp: Date.now(),
      url: sanitizeUrl(window.location.href),
      path,
      title: document.title,
      referrer: sanitizeReferrer(document.referrer),
      userAgent,
      properties: { deviceType: /iPad|tablet/i.test(userAgent) ? "tablet" : /Mobi|Android/i.test(userAgent) ? "mobile" : "desktop" },
    };
    void fetch(EVENTS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "omit",
      referrerPolicy: "no-referrer",
      keepalive: true,
    }).catch(() => undefined);
  } catch { /* Tracking must never interrupt navigation, including synchronous fetch failures. */ }
};

/** New public visit after marketing unmount; keep the browser session, not path history. */
export const resetGhlPageViewDedupe = (): void => { lastPath = undefined; };