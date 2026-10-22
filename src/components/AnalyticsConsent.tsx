import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  CONSENT_EVENT,
  disableTracking,
  getConsent,
  isAllowedHost,
  resetPageViewDedupe,
  setConsent,
  trackPageView,
} from "@/lib/analytics";

/** Consent banner + page_view tracking. Mounted only inside the public marketing layout. */
const AnalyticsConsent = () => {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (getConsent() === null && isAllowedHost(window.location.hostname)) setOpen(true);
    const reopen = () => setOpen(true);
    window.addEventListener(CONSENT_EVENT, reopen);
    return () => {
      window.removeEventListener(CONSENT_EVENT, reopen);
      disableTracking();
      resetPageViewDedupe();
    };
  }, []);

  useEffect(() => {
    // Wait a tick so the page's <title> is set by Seo.
    const t = window.setTimeout(() => trackPageView(pathname), 50);
    return () => window.clearTimeout(t);
  }, [pathname]);

  const choose = (v: "granted" | "denied") => {
    setConsent(v);
    setOpen(false);
    if (v === "granted") {
      resetPageViewDedupe();
      trackPageView(pathname);
    }
  };

  if (!open) return null;
  const current = getConsent();

  return (
    <div
      role="dialog"
      aria-labelledby="analytics-consent-title"
      className="fixed inset-x-3 bottom-3 z-[70] mx-auto max-w-xl border border-primary/30 bg-secondary p-5 text-secondary-foreground shadow-2xl md:bottom-6"
    >
      <p id="analytics-consent-title" className="display-heading text-xl">Analytics cookies</p>
      <p className="mt-2 font-body text-sm leading-6 text-secondary-foreground/75">
        With your permission we use Google Analytics to understand how visitors use our website. Google Analytics only runs if you accept.
        {current && <> Current choice: {current === "granted" ? "accepted" : "rejected"}.</>}
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button type="button" onClick={() => choose("granted")} className="rounded-none font-body text-xs uppercase tracking-[0.15em]">
          Accept analytics
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => choose("denied")}
          className="rounded-none border-secondary-foreground/30 bg-transparent font-body text-xs uppercase tracking-[0.15em] text-secondary-foreground hover:bg-secondary-foreground/10 hover:text-secondary-foreground"
        >
          Reject
        </Button>
      </div>
    </div>
  );
};

export const openCookieSettings = () => window.dispatchEvent(new Event(CONSENT_EVENT));

export default AnalyticsConsent;
