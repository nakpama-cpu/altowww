import { describe, it, expect, beforeEach, afterAll } from "vitest";
import {
  isAllowedHost, isPublicPath, sanitizeUrl, sanitizeReferrer, setConsent,
  syncTracking, disableTracking, isDisabled, __setHostForTest,
} from "@/lib/analytics";

describe("analytics scope", () => {
  it("only tracks the live domains", () => {
    expect(isAllowedHost("www.altowhisky.com")).toBe(true);
    expect(isAllowedHost("altowhisky.com")).toBe(true);
    expect(isAllowedHost("id-preview--x.lovable.app")).toBe(false);
  });
  it("excludes portal, admin and invoice paths", () => {
    expect(isPublicPath("/portal/login")).toBe(false);
    expect(isPublicPath("/admin")).toBe(false);
    expect(isPublicPath("/invoice/abc")).toBe(false);
    expect(isPublicPath("/book-a-call")).toBe(true);
  });
  it("keeps only safe utm params", () => {
    expect(sanitizeUrl("https://www.altowhisky.com/invest?utm_source=ig&fbclid=x&email=a@b.com&token=1#h"))
      .toBe("https://www.altowhisky.com/invest?utm_source=ig");
  });
  it("keeps numeric utm_id and campaign spaces, drops phone/email values", () => {
    const u = new URL(sanitizeUrl(
      "https://www.altowhisky.com/?utm_id=52583131419936&utm_campaign=Autumn%20Casks&utm_term=07700%20900123&utm_content=a@b.com",
    ));
    expect(u.searchParams.get("utm_id")).toBe("52583131419936");
    expect(u.searchParams.get("utm_campaign")).toBe("Autumn Casks");
    expect(u.searchParams.get("utm_term")).toBeNull();
    expect(u.searchParams.get("utm_content")).toBeNull();
    expect(sanitizeUrl("https://www.altowhisky.com/?utm_id=abc")).toBe("https://www.altowhisky.com/");
  });
  it("reduces referrer to origin", () => {
    expect(sanitizeReferrer("https://www.altowhisky.com/invoice/secret-token?x=1")).toBe("https://www.altowhisky.com");
  });
});

describe("consent and route gating", () => {
  beforeEach(() => {
    __setHostForTest("www.altowhisky.com");
    window.history.pushState({}, "", "/");
    localStorage.clear();
  });
  afterAll(() => __setHostForTest(null));

  it("re-enables after denied then granted", () => {
    setConsent("granted");
    expect(isDisabled()).toBe(false);
    setConsent("denied");
    expect(isDisabled()).toBe(true);
    setConsent("granted");
    expect(isDisabled()).toBe(false);
  });

  it("disables on private route and re-enables on return to public", () => {
    setConsent("granted");
    expect(isDisabled()).toBe(false);
    window.history.pushState({}, "", "/portal/my-casks");
    disableTracking(); // marketing layout unmounts
    expect(isDisabled()).toBe(true);
    expect(syncTracking()).toBe(false);
    expect(isDisabled()).toBe(true);
    window.history.pushState({}, "", "/news");
    expect(syncTracking()).toBe(true);
    expect(isDisabled()).toBe(false);
  });

  it("stays off on preview hosts", () => {
    __setHostForTest("id-preview--x.lovable.app");
    setConsent("granted");
    expect(isDisabled()).toBe(true);
  });
});
