// GA4 for the public marketing site only. Runs automatically on the live
// domains and never on preview hosts or portal/admin/invoice paths.
export const GA_MEASUREMENT_ID = "G-7ZP3WDHB4L";

const ALLOWED_HOSTS = ["altowhisky.com", "www.altowhisky.com"];
const BLOCKED_PREFIXES = ["/portal", "/admin", "/invoice", "/auth", "/checkout", "/login", "/signup"];
const SAFE_UTM = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "utm_id"];
const DISABLE_KEY = `ga-disable-${GA_MEASUREMENT_ID}`;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

let hostOverride: string | null = null;
/** Test-only: simulate the live hostname. */
export const __setHostForTest = (h: string | null) => {
  hostOverride = h;
};
const currentHost = () => hostOverride ?? window.location.hostname;

export const isAllowedHost = (host: string) => ALLOWED_HOSTS.includes(host.toLowerCase());

export const isPublicPath = (path: string) =>
  !BLOCKED_PREFIXES.some((p) => path === p || path.startsWith(p + "/"));

/** utm_id must be a numeric campaign ID; other tags keep readable text but drop PII-like values. */
export const cleanUtmValue = (key: string, v: string): string => {
  const value = v.trim();
  if (key === "utm_id") return /^\d{1,25}$/.test(value) ? value : "";
  if (/@|token|key=|password|secret/i.test(value)) return "";
  if (/\+?\d[\d\s().-]{6,}\d/.test(value)) return ""; // phone-like
  return value.replace(/[^\w\s\-.|]/g, "").replace(/\s+/g, " ").slice(0, 100).trim();
};

/** Origin + path + only known-safe UTM params. Drops hash and everything else. */
export const sanitizeUrl = (raw: string): string => {
  try {
    const u = new URL(raw);
    const out = new URL(u.origin + u.pathname);
    for (const k of SAFE_UTM) {
      const v = u.searchParams.get(k);
      const c = v ? cleanUtmValue(k, v) : "";
      if (c) out.searchParams.set(k, c);
    }
    return out.toString();
  } catch {
    return "";
  }
};

/** Referrer reduced to origin only (private paths may carry tokens). */
export const sanitizeReferrer = (raw: string): string => {
  try {
    return new URL(raw).origin;
  } catch {
    return "";
  }
};

const canTrack = () =>
  typeof window !== "undefined" &&
  isAllowedHost(currentHost()) &&
  isPublicPath(window.location.pathname);

const setDisabled = (disabled: boolean) => {
  (window as unknown as Record<string, unknown>)[DISABLE_KEY] = disabled;
};

export const isDisabled = () =>
  (window as unknown as Record<string, unknown>)[DISABLE_KEY] !== false;

const safeContext = () => ({
  page_location: sanitizeUrl(window.location.href),
  page_referrer: sanitizeReferrer(document.referrer),
  page_title: document.title,
});

let loaded = false;
const ensureLoaded = () => {
  if (loaded) return;
  loaded = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID, {
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    ...safeContext(),
  });
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(s);
};

/** Enable GA only on allowed host + public path; otherwise disable immediately. */
export const syncTracking = (): boolean => {
  if (typeof window === "undefined") return false;
  if (!canTrack()) {
    setDisabled(true);
    return false;
  }
  setDisabled(false);
  ensureLoaded();
  window.gtag?.("set", safeContext());
  return true;
};

/** Called when the marketing layout unmounts (e.g. navigating into the portal). */
export const disableTracking = () => {
  if (typeof window !== "undefined") setDisabled(true);
};

let lastPath = "";
export const trackPageView = (path: string) => {
  if (!syncTracking() || path === lastPath) return;
  lastPath = path;
  window.gtag?.("event", "page_view", { ...safeContext(), page_path: path });
};

export const trackBookCallClick = () => {
  if (!syncTracking()) return;
  window.gtag?.("event", "book_call_click", { ...safeContext(), page_path: window.location.pathname });
};

/** Reset de-dupe so the current page is counted again (after re-entering public pages). */
export const resetPageViewDedupe = () => {
  lastPath = "";
};
