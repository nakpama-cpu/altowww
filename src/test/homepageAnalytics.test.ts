import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createSectionDwell, foregroundSection, homepageCtaFor, startHomepageAnalytics } from "@/lib/homepageAnalytics";
import { __setHostForTest, CONSENT_CHANGE_EVENT, setConsent, trackHomepageCta } from "@/lib/analytics";

afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); __setHostForTest(null); });

describe("foreground visibility", () => {
  it("requires half of the smaller section/viewport height", () => {
    expect(foregroundSection([{ id: "opportunity", height: 1800, visiblePixels: 399 }], 800)).toBeNull();
    expect(foregroundSection([{ id: "opportunity", height: 1800, visiblePixels: 400 }], 800)).toBe("opportunity");
    expect(foregroundSection([{ id: "heritage", height: 380, visiblePixels: 189 }], 800)).toBeNull();
    expect(foregroundSection([{ id: "heritage", height: 380, visiblePixels: 190 }], 800)).toBe("heritage");
  });
  it("chooses only the foreground chapter rather than the covered fixed hero", () => {
    expect(foregroundSection([
      { id: "heritage", height: 380, visiblePixels: 0 },
      { id: "opportunity", height: 1800, visiblePixels: 800 },
    ], 800)).toBe("opportunity");
  });
});

describe("continuous dwell per visit", () => {
  beforeEach(() => vi.useFakeTimers());
  it("fires at 2 seconds and deduplicates revisits", () => {
    const send = vi.fn(() => true);
    const dwell = createSectionDwell(send);
    const check = () => dwell.update("cask", true, check);
    check(); vi.advanceTimersByTime(1999); expect(send).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1); expect(send).toHaveBeenCalledExactlyOnceWith("cask");
    dwell.update(null, true, check); check(); vi.advanceTimersByTime(3000);
    expect(send).toHaveBeenCalledTimes(1);
    dwell.cancel();
    const nextVisit = createSectionDwell(send);
    const nextCheck = () => nextVisit.update("cask", true, nextCheck);
    nextCheck(); vi.advanceTimersByTime(2000); expect(send).toHaveBeenCalledTimes(2);
    nextVisit.cancel();
  });
  it("late consent starts a new dwell and withdrawal cancels it without replay", () => {
    const send = vi.fn(() => true); const dwell = createSectionDwell(send);
    let allowed = false;
    const check = () => dwell.update("news", allowed, check);
    check(); vi.advanceTimersByTime(4000); expect(send).not.toHaveBeenCalled();
    allowed = true; check(); vi.advanceTimersByTime(1500);
    allowed = false; check(); vi.advanceTimersByTime(3000); expect(send).not.toHaveBeenCalled();
    allowed = true; check(); vi.advanceTimersByTime(1999); expect(send).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1); expect(send).toHaveBeenCalledExactlyOnceWith("news"); dwell.cancel();
  });
  it.each(["offscreen", "document hidden", "unmount"])("cancels interrupted dwell: %s", () => {
    const send = vi.fn(() => true); const dwell = createSectionDwell(send);
    const check = () => dwell.update("process", true, check);
    check(); vi.advanceTimersByTime(1900); dwell.cancel(); vi.advanceTimersByTime(3000);
    expect(send).not.toHaveBeenCalled(); check(); vi.advanceTimersByTime(2000);
    expect(send).toHaveBeenCalledTimes(1); dwell.cancel();
  });
});

describe("homepage integration and CTA allowlist", () => {
  beforeEach(() => {
    window.history.pushState({}, "", "/"); localStorage.clear(); __setHostForTest("www.altowhisky.com");
  });
  it("attributes brochure/advisor, header/footer, links and destination chapters without free text", () => {
    const fixture = document.createElement("div");
    fixture.innerHTML = '<header><button data-analytics-cta="request_brochure">personal data</button></header><section id="opportunity"><button data-analytics-cta="speak_to_advisor"></button></section><footer><a href="/privacy-policy"></a></footer><nav><a data-analytics-chapter="investment" href="#investment"></a></nav><section id="news"><a href="/news/example-story"></a><a href="/news?email=a@b.com"></a><button>Request brochure</button></section>';
    const controls = fixture.querySelectorAll("a, button");
    expect(homepageCtaFor(controls[0])).toEqual({ section: "header", cta: "request_brochure" });
    expect(homepageCtaFor(controls[1])).toEqual({ section: "opportunity", cta: "speak_to_advisor" });
    expect(homepageCtaFor(controls[2])).toEqual({ section: "footer", cta: "privacy_policy" });
    expect(homepageCtaFor(controls[3])).toEqual({ section: "investment", cta: "chapter_navigation" });
    expect(homepageCtaFor(controls[4])).toEqual({ section: "news", cta: "read_article" });
    expect(homepageCtaFor(controls[5])).toBeNull(); expect(homepageCtaFor(controls[6])).toBeNull();
  });
  it("gates CTA events by consent, live host, and homepage, using only safe params", () => {
    const spy = vi.fn(); window.gtag = spy;
    expect(trackHomepageCta("heritage", "request_brochure")).toBe(false);
    setConsent("granted"); window.gtag = spy; spy.mockClear();
    window.history.pushState({}, "", "/?email=a@b.com&token=secret#private");
    expect(trackHomepageCta("footer", "speak_to_advisor")).toBe(true);
    expect(spy).toHaveBeenCalledWith("event", "cta_click", expect.objectContaining({
      section_id: "footer", section_name: "Footer", cta_name: "speak_to_advisor", page_path: "/", page_location: window.location.origin + "/",
    }));
    setConsent("denied"); expect(trackHomepageCta("footer", "speak_to_advisor")).toBe(false);
    setConsent("granted"); __setHostForTest("preview.lovable.app"); expect(trackHomepageCta("header", "home")).toBe(false);
    __setHostForTest("www.altowhisky.com"); window.history.pushState({}, "", "/news"); expect(trackHomepageCta("header", "home")).toBe(false);
  });
  it("separates consent changes from opening settings", () => {
    const changed = vi.fn(); const opened = vi.fn();
    window.addEventListener(CONSENT_CHANGE_EVENT, changed); window.addEventListener("alto:open-cookie-settings", opened);
    setConsent("granted"); setConsent("denied"); expect(changed).toHaveBeenCalledTimes(2); expect(opened).not.toHaveBeenCalled();
    window.removeEventListener(CONSENT_CHANGE_EVENT, changed); window.removeEventListener("alto:open-cookie-settings", opened);
  });
  it("hit-tests the overlaid hero, supports late consent and cancels hidden/unmounted timers", () => {
    vi.useFakeTimers();
    const fixture = document.createElement("div"); fixture.innerHTML = '<section id="heritage"></section><section id="opportunity"></section>';
    document.body.append(fixture);
    const hero = fixture.children[0]; const opportunity = fixture.children[1];
    vi.spyOn(hero, "getBoundingClientRect").mockReturnValue({ top: 0, bottom: 380, height: 380 } as DOMRect);
    vi.spyOn(opportunity, "getBoundingClientRect").mockReturnValue({ top: 0, bottom: 2000, height: 2000 } as DOMRect);
    Object.defineProperty(document, "elementFromPoint", { configurable: true, value: () => opportunity });
    vi.stubGlobal("ResizeObserver", class { observe() {} disconnect() {} });
    let visible = "visible"; vi.spyOn(document, "visibilityState", "get").mockImplementation(() => visible as DocumentVisibilityState);
    const stop = startHomepageAnalytics(); const spy = vi.fn();
    vi.advanceTimersByTime(3000); setConsent("granted"); window.gtag = spy;
    vi.advanceTimersByTime(1900); visible = "hidden"; document.dispatchEvent(new Event("visibilitychange"));
    vi.advanceTimersByTime(2500); expect(spy.mock.calls.filter((c) => c[1] === "section_view")).toHaveLength(0);
    visible = "visible"; document.dispatchEvent(new Event("visibilitychange")); vi.advanceTimersByTime(2000);
    expect(spy.mock.calls.filter((c) => c[1] === "section_view").map((c) => c[2].section_id)).toEqual(["opportunity"]);
    stop(); vi.advanceTimersByTime(3000); expect(spy.mock.calls.filter((c) => c[1] === "section_view")).toHaveLength(1);
    fixture.remove(); vi.unstubAllGlobals();
  });
});