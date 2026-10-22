// GA4 for the public marketing site only. Loads nothing until the visitor
// accepts analytics, and never runs on preview hosts or portal/admin/invoice paths.
export const GA_MEASUREMENT_ID = "G-7ZP3WDHB4L";
export const CONSENT_KEY = "alto_analytics_consent"; // "granted" | "denied"
export const CONSENT_EVENT = "alto:open-cookie-settings";

const ALLOWED_HOSTS = ["altowhisky.com", "www.altowhisky.com"];
const BLOCKED_PREFIXES = ["/portal", "/admin", "/invoice", "/auth", "/checkout", "/login", "/signup"];
const SAFE_UTM = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export const isAllowedHost = (host: string) => ALLOWED_HOSTS.includes(host.toLowerCase());

export const isPublicPath = (path: string) =>
  !BLOCKED_PREFIXES.some((p) => path === p || path.startsWith(p + "/"));

const cleanValue = (v: string) =>
  /@|token|key=/i.test(v) ? "" : v.replace(/[^\w\-.]/g, "").slice(0, 100);

/** Origin + path + only known-safe UTM params. Drops hash and everything else. */
export const sanitizeUrl = (raw: string): string => {
  try {
    const u = new URL(raw);
    const out = new URL(u.origin + u.pathname);
    for (const k of SAFE_UTM) {
      const v = u.searchParams.get(k);
      const c = v ? cleanValue(v) : "";
      if (c) out.searchParams.set(k, c);
    }
    return out.toString();
  } catch {
    return "";
  }
};

/** Referrer reduced to origin + path, no query. */
export const sanitizeReferrer = (raw: string): string => {
  try {
    const u = new URL(raw);
    return u.origin + u.pathname;
  } catch {
    return "";
  }
};

export const getConsent = (): "granted" | "denied" | null => {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
};

const canTrack = () =>
  typeof window !== "undefined" &&
  isAllowedHost(window.location.hostname) &&
  isPublicPath(window.location.pathname) &&
  getConsent() === "granted";

let loaded = false;
const ensureLoaded = () => {
  if (loaded) return;
  loaded = true;
  (window as unknown as Record<string, unknown>)[`ga-disable-${GA_MEASUREMENT_ID}`] = false;
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
  });
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(s);
};

export const setConsent = (value: "granted" | "denied") => {
  try {
    localStorage.setItem(CONSENT_KEY, value);
  } catch {
    /* ignore */
  }
  if (value === "denied") {
    (window as unknown as Record<string, unknown>)[`ga-disable-${GA_MEASUREMENT_ID}`] = true;
    // Remove GA cookies on withdrawal.
    document.cookie.split(";").forEach((c) => {
      const name = c.split("=")[0].trim();
      if (name.startsWith("_ga")) {
        for (const d of ["", "; domain=.altowhisky.com"]) {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${d}`;
        }
      }
    });
  }
};

let lastPath = "";
export const trackPageView = (path: string) => {
  if (!canTrack() || path === lastPath) return;
  ensureLoaded();
  lastPath = path;
  window.gtag?.("event", "page_view", {
    page_location: sanitizeUrl(window.location.href),
    page_path: path,
    page_referrer: sanitizeReferrer(document.referrer),
    page_title: document.title,
  });
};

export const trackBookCallClick = () => {
  if (!canTrack()) return;
  ensureLoaded();
  window.gtag?.("event", "book_call_click", { page_path: window.location.pathname });
};

/** Reset de-dupe so the current page is counted right after consent is granted. */
export const resetPageViewDedupe = () => {
  lastPath = "";
};
