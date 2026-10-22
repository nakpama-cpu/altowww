import { describe, it, expect } from "vitest";
import { isAllowedHost, isPublicPath, sanitizeUrl, sanitizeReferrer } from "@/lib/analytics";

describe("analytics scope", () => {
  it("only tracks the live domains", () => {
    expect(isAllowedHost("www.altowhisky.com")).toBe(true);
    expect(isAllowedHost("altowhisky.com")).toBe(true);
    expect(isAllowedHost("id-preview--x.lovable.app")).toBe(false);
    expect(isAllowedHost("localhost")).toBe(false);
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
  it("strips referrer query", () => {
    expect(sanitizeReferrer("https://l.facebook.com/x?u=secret")).toBe("https://l.facebook.com/x");
  });
});
