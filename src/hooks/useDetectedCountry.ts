import { useEffect, useState } from "react";
import { countryByCode } from "@/data/countries";

// Best-effort country detection: IP first (ipapi.co), then browser locale.
// Returns { code, dialingCode } or null. Safe to call unconditionally.
export function useDetectedCountry() {
  const [detected, setDetected] = useState<{ code: string; dialingCode: string } | null>(null);

  useEffect(() => {
    let cancelled = false;

    const resolve = (code: string | undefined | null) => {
      if (!code) return null;
      const c = countryByCode.get(code.toUpperCase());
      return c ? { code: c.code, dialingCode: c.dialingCode } : null;
    };

    const fromLocale = (): string | null => {
      try {
        const langs = [navigator.language, ...(navigator.languages ?? [])];
        for (const l of langs) {
          const m = l && l.match(/[-_]([A-Za-z]{2})\b/);
          if (m) return m[1].toUpperCase();
        }
      } catch {
        /* ignore */
      }
      return null;
    };

    const run = async () => {
      // Try IP-based lookup (no key required, HTTPS, CORS-enabled)
      try {
        const res = await fetch("https://ipapi.co/json/", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          const hit = resolve(data?.country_code);
          if (!cancelled && hit) {
            setDetected(hit);
            return;
          }
        }
      } catch {
        /* fall through to locale */
      }
      const hit = resolve(fromLocale());
      if (!cancelled && hit) setDetected(hit);
    };

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  return detected;
}
