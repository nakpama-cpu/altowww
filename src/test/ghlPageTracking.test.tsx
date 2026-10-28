import { StrictMode } from "react";
import { act, cleanup, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import { readGhlContact, resetGhlPageViewDedupe, trackGhlPageView } from "@/lib/ghlPageTracking";

vi.mock("@/lib/analytics", async (importOriginal) => ({
  ...await importOriginal<typeof import("@/lib/analytics")>(),
  trackPageView: vi.fn(), disableTracking: vi.fn(), resetPageViewDedupe: vi.fn(),
}));

const ID = "AbCdEf0123456789GhIj";
const cookie = (contactId: unknown, expiresAt: unknown) =>
  `alto_ghl_contact_v1=${encodeURIComponent(JSON.stringify({ contactId, expiresAt }))}`;
const fetchMock = vi.fn();
const location = (path = "/", hostname = "www.altowhisky.com", query = "") => {
  vi.spyOn(window, "location", "get").mockReturnValue({
    ...window.location, hostname, pathname: path, href: `https://${hostname}${path}${query}`,
  });
};

beforeEach(() => {
  resetGhlPageViewDedupe();
  fetchMock.mockReset().mockResolvedValue({ ok: true });
  vi.stubGlobal("fetch", fetchMock);
  location();
  vi.spyOn(document, "cookie", "get").mockReturnValue("");
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe("guide contact cookie", () => {
  it("reads the valid unexpired 20-character identity among other cookies", () => {
    expect(readGhlContact(`other=x; ${cookie(ID, 1000 + 30 * 86400000)}; another=y`, 1000)).toBe(ID);
  });
  it("does not use expired identity, including expiry at the current millisecond", () => {
    expect(readGhlContact(cookie(ID, 999), 1000)).toBeUndefined();
    expect(readGhlContact(cookie(ID, 1000), 1000)).toBeUndefined();
  });
  it.each(["", "alto_ghl_contact_v1=%XX", "alto_ghl_contact_v1=null",
    cookie("abc", 2000), cookie("1234567890123456789-", 2000), cookie(ID, "2000"),
    "other_alto_ghl_contact_v1=anything"])("ignores malformed or invalid cookies: %s", (value) => {
    expect(readGhlContact(value, 1000)).toBeUndefined();
  });
});

describe("native GHL page events", () => {
  it.each(["altowhisky.com", "www.altowhisky.com"])("sends on the allowed live host %s", (host) => {
    location("/news", host);
    trackGhlPageView("/news");
    expect(fetchMock).toHaveBeenCalledOnce();
  });
  it.each(["localhost", "id-preview--x.lovable.app", "portal.altowhisky.com"])("never sends on %s", (host) => {
    location("/", host);
    trackGhlPageView("/");
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it.each(["/portal/my-casks", "/admin", "/invoice/secret", "/auth/callback", "/checkout", "/login", "/signup"])
    ("blocks both requested and current private path %s, including delayed public dispatch", (path) => {
      location();
      trackGhlPageView(path);
      location(path);
      trackGhlPageView("/");
      trackGhlPageView(path);
      expect(fetchMock).not.toHaveBeenCalled();
    });
  it("drops stale pathname dispatch without consuming the new route entry", () => {
    location("/news");
    trackGhlPageView("/");
    expect(fetchMock).not.toHaveBeenCalled();
    trackGhlPageView("/news");
    expect(fetchMock).toHaveBeenCalledOnce();
  });
  it("deduplicates rerenders but counts A→B→A and a new marketing mount", () => {
    trackGhlPageView("/");
    trackGhlPageView("/");
    location("/news");
    trackGhlPageView("/news");
    location();
    trackGhlPageView("/");
    expect(fetchMock).toHaveBeenCalledTimes(3);
    resetGhlPageViewDedupe();
    trackGhlPageView("/");
    expect(fetchMock).toHaveBeenCalledTimes(4);
    const sessions = fetchMock.mock.calls.map(([, options]) => JSON.parse(options.body).sessionId);
    expect(new Set(sessions).size).toBe(1);
    expect(sessions[0]).toMatch(/^[0-9a-f-]{36}$/);
  });
  it("sends the native sanitized payload with cookie identity only in contactId", () => {
    location("/book-a-call", "www.altowhisky.com", `?contactId=${ID}&email=person@example.com&utm_source=ig&utm_id=123456&token=secret#private`);
    vi.spyOn(document, "cookie", "get").mockReturnValue(cookie(ID, Date.now() + 30 * 86400000));
    vi.spyOn(document, "referrer", "get").mockReturnValue("https://altowhisky.com/invoice/private-token?email=person@example.com");
    trackGhlPageView("/book-a-call");
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe("https://backend.leadconnectorhq.com/external-tracking/events");
    expect(options).toMatchObject({ method: "POST", credentials: "omit", referrerPolicy: "no-referrer" });
    const payload = JSON.parse(options.body);
    expect(payload).toMatchObject({
      type: "external_script_page_view", trackingId: "tk_2751e8cae0ce412dac03062b84744fae",
      contactId: ID, path: "/book-a-call", url: "https://www.altowhisky.com/book-a-call?utm_source=ig&utm_id=123456",
      referrer: "https://altowhisky.com", title: "Book A Call", userAgent: navigator.userAgent,
      properties: { deviceType: "desktop" },
    });
    expect(payload.timestamp).toBeGreaterThan(0);
    expect(options.body).not.toContain("person@example.com");
    expect(options.body).not.toContain("private-token");
  });
  it.each([
    [<h1>How It Works</h1>, "How It Works"],
    [<h1><img alt="How It Works" /></h1>, "How It Works"],
  ])("uses the current rendered h1 rather than the previous route's document.title", (heading, expected) => {
    location("/how-it-works");
    vi.spyOn(document, "title", "get").mockReturnValue("Why Whisky");
    render(heading);
    trackGhlPageView("/how-it-works");
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toMatchObject({
      title: expected, path: "/how-it-works", url: "https://www.altowhisky.com/how-it-works",
    });
  });
  it("omits expired contact identity rather than backfilling events", () => {
    vi.spyOn(document, "cookie", "get").mockReturnValue(cookie(ID, Date.now() - 1));
    trackGhlPageView("/");
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).not.toHaveProperty("contactId");
    vi.spyOn(document, "cookie", "get").mockReturnValue(cookie(ID, Date.now() + 10000));
    trackGhlPageView("/");
    expect(fetchMock).toHaveBeenCalledOnce();
    location("/news");
    trackGhlPageView("/news");
    expect(JSON.parse(fetchMock.mock.calls[1][1].body).contactId).toBe(ID);
  });
  it.each([false, true])("silently handles fetch failures (synchronous=%s), without retry", async (sync) => {
    if (sync) fetchMock.mockImplementation(() => { throw new Error("offline"); });
    else fetchMock.mockRejectedValue(new Error("offline"));
    expect(() => trackGhlPageView("/")).not.toThrow();
    await Promise.resolve();
    trackGhlPageView("/");
    expect(fetchMock).toHaveBeenCalledOnce();
  });
});

describe("marketing tracker lifecycle", () => {
  it("deduplicates StrictMode, cancels delayed navigation, and resets on actual unmount", () => {
    vi.useFakeTimers();
    const view = render(<StrictMode><MemoryRouter><AnalyticsTracker /></MemoryRouter></StrictMode>);
    act(() => { vi.advanceTimersByTime(50); });
    expect(fetchMock).toHaveBeenCalledOnce();
    view.rerender(<StrictMode><MemoryRouter><AnalyticsTracker /></MemoryRouter></StrictMode>);
    act(() => { vi.advanceTimersByTime(100); });
    expect(fetchMock).toHaveBeenCalledOnce();
    view.unmount();
    const next = render(<MemoryRouter><AnalyticsTracker /></MemoryRouter>);
    location("/portal/login");
    act(() => { vi.advanceTimersByTime(50); });
    expect(fetchMock).toHaveBeenCalledOnce();
    next.unmount();
    location();
    render(<MemoryRouter><AnalyticsTracker /></MemoryRouter>);
    act(() => { vi.advanceTimersByTime(50); });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});