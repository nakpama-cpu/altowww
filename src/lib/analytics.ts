// GA4 for the public marketing site only. Loads nothing until the visitor
// accepts analytics, and never runs on preview hosts or portal/admin/invoice paths.
export const GA_MEASUREMENT_ID = "G-7ZP3WDHB4L";
export const CONSENT_KEY = "alto_analytics_consent"; // "granted" | "denied"
export const CONSENT_EVENT = "alto:open-cookie-settings";
export const CONSENT_CHANGE_EVENT = "alto:analytics-consent-changed";

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
  isAllowedHost(currentHost()) &&
  isPublicPath(window.location.pathname) &&
  getConsent() === "granted";

export const canTrackHomepage = () => canTrack() && window.location.pathname === "/";

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
    window.dataLayer?.push(arguments);
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

/** Enable GA only on allowed host + public path + consent; otherwise disable immediately. */
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

export const setConsent = (value: "granted" | "denied") => {
  try {
    localStorage.setItem(CONSENT_KEY, value);
  } catch {
    /* ignore */
  }
  if (value === "denied") {
    setDisabled(true);
    document.cookie.split(";").forEach((c) => {
      const name = c.split("=")[0].trim();
      if (name.startsWith("_ga")) {
        for (const d of ["", "; domain=.altowhisky.com"]) {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${d}`;
        }
      }
    });
  } else {
    syncTracking();
  }
  window.dispatchEvent(new Event(CONSENT_CHANGE_EVENT));
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

/** Reset de-dupe so the current page is counted again (after consent or re-entering public pages). */
export const resetPageViewDedupe = () => {
  lastPath = "";
};

export const HOME_SECTIONS = {
  heritage: "Alto Whisky",
  opportunity: "The Opportunity",
  "why-whisky": "Why Whisky",
  investment: "The Investment",
  cask: "Your Cask",
  process: "The Process",
  distilleries: "Distilleries",
  news: "News & Insights",
  footer: "Footer",
} as const;
export type HomeSectionId = keyof typeof HOME_SECTIONS;
export const CTA_SECTIONS = { ...HOME_SECTIONS, header: "Header" } as const;
export type CtaSectionId = keyof typeof CTA_SECTIONS;
export const HOME_CTA_NAMES = [
  "request_brochure", "speak_to_advisor", "chapter_navigation", "chapter_previous", "chapter_next",
  "home", "news_insights", "why_whisky", "how_it_works", "contact", "explore_regions",
  "how_whisky_is_made", "faqs", "privacy_policy", "read_article", "invest",
] as const;
export type HomeCtaName = typeof HOME_CTA_NAMES[number];

export const trackHomepageSection = (section: HomeSectionId) => {
  if (window.location.pathname !== "/" || !Object.prototype.hasOwnProperty.call(HOME_SECTIONS, section) || !syncTracking()) return false;
  window.gtag?.("event", "section_view", {
    ...safeContext(), section_id: section, section_name: HOME_SECTIONS[section], page_path: "/",
  });
  return true;
};

export const trackHomepageCta = (section: CtaSectionId, cta: HomeCtaName) => {
  if (window.location.pathname !== "/" || !Object.prototype.hasOwnProperty.call(CTA_SECTIONS, section) ||
      !HOME_CTA_NAMES.includes(cta) || !syncTracking()) return false;
  window.gtag?.("event", "cta_click", {
    ...safeContext(), section_id: section, section_name: CTA_SECTIONS[section], cta_name: cta, page_path: "/",
  });
  return true;
};
