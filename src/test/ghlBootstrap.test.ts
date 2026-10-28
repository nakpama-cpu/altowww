import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { readGhlContact } from "@/lib/ghlPageTracking";

const code = readFileSync("public/ghl-bootstrap.js", "utf8").replace(/\}\)\(window, document, window\.history\);\s*$/, "})(w, d, h);");
const html = readFileSync("index.html", "utf8");

const run = (href: string, cookie = "") => {
  const doc = { cookie };
  const calls: string[] = [];
  const hist = { state: { k: 1 }, replaceState: (_s: unknown, _t: string, u: string) => calls.push(u) };
  new Function("w", "d", "h", code)({ location: { href } }, doc, hist);
  return { cookie: doc.cookie, calls };
};
const ID = "AbCdEfGhIj0123456789";

describe("GHL alcid bootstrap", () => {
  it("loads before Meta Pixel and the app", () => {
    const i = html.indexOf("/ghl-bootstrap.js");
    expect(i).toBeGreaterThan(-1);
    expect(i).toBeLessThan(html.indexOf("fbq("));
    expect(i).toBeLessThan(html.indexOf("/src/main.tsx"));
  });

  it("stores a compatible cookie and strips only alcid on live public arrival", () => {
    const r = run(`https://www.altowhisky.com/book-a-call?utm_source=x&alcid=${ID}&b=2#cal`);
    expect(r.calls).toEqual(["/book-a-call?utm_source=x&b=2#cal"]);
    expect(r.cookie).toMatch(/Domain=altowhisky\.com; Path=\/; Secure; SameSite=Lax$/);
    expect(readGhlContact(r.cookie.split(";")[0])).toBe(ID);
    const { expiresAt } = JSON.parse(decodeURIComponent(r.cookie.split(";")[0].split("=")[1]));
    expect(Math.round((expiresAt - Date.now()) / 86400000)).toBe(30);
  });

  it("removes invalid alcid without replacing a valid cookie", () => {
    const r = run("https://altowhisky.com/?alcid=bad", "keep");
    expect(r.calls).toEqual(["/"]);
    expect(r.cookie).toBe("keep");
  });

  it("strips on live private paths but never identifies", () => {
    const r = run(`https://www.altowhisky.com/portal/login?alcid=${ID}`);
    expect(r.calls).toEqual(["/portal/login"]);
    expect(r.cookie).toBe("");
  });

  it("does nothing on previews", () => {
    expect(run(`https://x.lovable.app/?alcid=${ID}`)).toEqual({ cookie: "", calls: [] });
  });
});
