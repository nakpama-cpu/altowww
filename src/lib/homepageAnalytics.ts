import {
  CONSENT_CHANGE_EVENT, CTA_SECTIONS, HOME_SECTIONS, syncTracking,
  trackHomepageCta, trackHomepageSection,
  type CtaSectionId, type HomeCtaName, type HomeSectionId,
} from "./analytics";

type SectionFrame = { id: HomeSectionId; height: number; visiblePixels: number };

/** One foreground chapter at a time; ties prefer the later, overlaid chapter. */
export const foregroundSection = (frames: SectionFrame[], viewportHeight: number): HomeSectionId | null => {
  let best: SectionFrame | null = null;
  for (const frame of frames) {
    if (frame.height <= 0 || frame.visiblePixels < Math.min(frame.height, viewportHeight) / 2) continue;
    if (!best || frame.visiblePixels >= best.visiblePixels) best = frame;
  }
  return best?.id ?? null;
};

/** Per-mount (homepage visit) dwell state, never persisted or replayed. */
export const createSectionDwell = (send: (id: HomeSectionId) => boolean) => {
  const seen = new Set<HomeSectionId>();
  let current: HomeSectionId | null = null;
  let started = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const cancel = () => {
    if (timer !== undefined) clearTimeout(timer);
    timer = undefined;
    current = null;
  };
  return {
    update(id: HomeSectionId | null, allowed: boolean, recheck: () => void) {
      if (!allowed || !id || seen.has(id)) { cancel(); return; }
      if (current !== id) {
        cancel();
        current = id;
        started = Date.now();
        timer = setTimeout(recheck, 2000);
        return;
      }
      if (Date.now() - started >= 2000) {
        if (send(id)) seen.add(id);
        cancel();
      }
    },
    cancel,
  };
};

const sectionId = (value: string | undefined): CtaSectionId | null =>
  value && Object.prototype.hasOwnProperty.call(CTA_SECTIONS, value) ? value as CtaSectionId : null;

const LINK_NAMES: Record<string, HomeCtaName> = {
  "/": "home", "/news": "news_insights", "/why-whisky": "why_whisky",
  "/how-it-works": "how_it_works", "/contact": "contact", "/about-whisky": "explore_regions",
  "/how-whisky-is-made": "how_whisky_is_made", "/faqs": "faqs",
  "/privacy-policy": "privacy_policy", "/invest": "invest",
};

/** Only explicit CTA markers and known internal destinations, never visible text. */
export const homepageCtaFor = (target: Element): { section: CtaSectionId; cta: HomeCtaName } | null => {
  const control = target.closest<HTMLElement>("a, button");
  if (!control || control.closest('[role="dialog"], [aria-modal="true"]')) return null;
  const chapter = sectionId(control.dataset.analyticsChapter);
  if (chapter && chapter !== "header" && chapter !== "footer") return { section: chapter, cta: "chapter_navigation" };
  const root = control.closest("header, footer, section");
  const section = root?.tagName === "HEADER" ? "header" : root?.tagName === "FOOTER" ? "footer" : sectionId(root?.id);
  if (!section) return null;
  if (control.dataset.analyticsCta === "request_brochure" || control.dataset.analyticsCta === "speak_to_advisor") {
    return { section, cta: control.dataset.analyticsCta };
  }
  if (control.tagName !== "A") return null;
  const href = control.getAttribute("href");
  if (!href) return null;
  // Exact relative routes only: unknown paths, queries, hashes and external URLs are not events.
  const cta = LINK_NAMES[href] ?? (/^\/news\/[a-z0-9-]+$/.test(href) ? "read_article" : null);
  return cta ? { section, cta } : null;
};

export const startHomepageAnalytics = () => {
  const roots = Object.keys(HOME_SECTIONS).flatMap((id) => {
    const element = id === "footer" ? document.querySelector("footer") : document.getElementById(id);
    return element ? [{ id: id as HomeSectionId, element }] : [];
  });
  const dwell = createSectionDwell(trackHomepageSection);
  let disposed = false;
  const measure = () => {
    const height = window.innerHeight;
    const rects = roots.map((root) => ({ ...root, rect: root.element.getBoundingClientRect(), pixels: 0 }));
    // Hit-test separate vertical intervals, including overlays. A fixed hero underneath
    // scrolling content gets no pixels where another root or a dialog is on top.
    const overlayRects = Array.from(document.querySelectorAll('header, [role="dialog"], [aria-modal="true"]'))
      .map((el) => el.getBoundingClientRect());
    const edges = [...new Set([0, height, ...[...rects.map((r) => r.rect), ...overlayRects]
      .flatMap((r) => [Math.max(0, Math.min(height, r.top)), Math.max(0, Math.min(height, r.bottom))])])].sort((a, b) => a - b);
    for (let i = 1; i < edges.length; i++) {
      const top = edges[i - 1];
      const bottom = edges[i];
      if (bottom <= top) continue;
      const front = document.elementFromPoint(window.innerWidth / 2, (top + bottom) / 2);
      if (!front || front.closest('header, [role="dialog"], [aria-modal="true"]')) continue;
      const root = rects.find((r) => r.element === front || r.element.contains(front));
      if (root) root.pixels += bottom - top;
    }
    return foregroundSection(rects.map((r) => ({ id: r.id, height: r.rect.height, visiblePixels: r.pixels })), height);
  };
  const check = () => {
    if (disposed) return;
    const allowed = document.visibilityState === "visible" && syncTracking();
    dwell.update(allowed ? measure() : null, allowed, check);
  };
  const click = (event: MouseEvent) => {
    if (!(event.target instanceof Element)) return;
    const attribution = homepageCtaFor(event.target);
    if (attribution) trackHomepageCta(attribution.section, attribution.cta);
  };
  window.addEventListener("scroll", check, { passive: true });
  window.addEventListener("resize", check);
  window.addEventListener(CONSENT_CHANGE_EVENT, check);
  document.addEventListener("visibilitychange", check);
  document.addEventListener("click", click, true);
  const resize = new ResizeObserver(check);
  roots.forEach(({ element }) => resize.observe(element));
  const mutations = new MutationObserver(check);
  mutations.observe(document.body, { childList: true, subtree: true });
  // Covers moving overlays / transitions without relying on IntersectionObserver,
  // which reports the fixed hero as intersecting even while completely covered.
  const poll = window.setInterval(check, 100);
  check();
  return () => {
    disposed = true;
    dwell.cancel();
    window.clearInterval(poll);
    resize.disconnect();
    mutations.disconnect();
    window.removeEventListener("scroll", check);
    window.removeEventListener("resize", check);
    window.removeEventListener(CONSENT_CHANGE_EVENT, check);
    document.removeEventListener("visibilitychange", check);
    document.removeEventListener("click", click, true);
  };
};