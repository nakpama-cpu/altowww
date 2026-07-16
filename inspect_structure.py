import asyncio
import os
import json
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        cookies_json = os.environ.get("LOVABLE_BROWSER_SUPABASE_COOKIES_JSON")
        session_json = os.environ.get("LOVABLE_BROWSER_SUPABASE_SESSION_JSON")
        storage_key = os.environ.get("LOVABLE_BROWSER_SUPABASE_STORAGE_KEY")
        context = await browser.new_context(viewport={'width': 1280, 'height': 1800})
        if cookies_json:
            cookies = json.loads(cookies_json)
            for cookie in cookies:
                if 'domain' not in cookie: cookie['domain'] = 'localhost'
                if 'path' not in cookie: cookie['path'] = '/'
            await context.add_cookies(cookies)
        page = await context.new_page()
        await page.goto("http://localhost:8080/")
        if session_json and storage_key:
            await page.evaluate("""([key, val]) => localStorage.setItem(key, val)""", [storage_key, session_json])
        await page.goto("http://localhost:8080/portal/account", wait_until="networkidle")
        await page.wait_for_selector("text=Address", timeout=10000)
        await page.locator("button:has-text('Verify')").first.click()
        await page.wait_for_selector("[role='dialog']", timeout=10000)

        structure = await page.evaluate('''() => {
            const l1 = Array.from(document.querySelectorAll('label')).find(l => l.textContent.includes("Document type"));
            const l2 = Array.from(document.querySelectorAll('label')).find(l => l.textContent.includes("Issue date"));
            
            if (!l1 || !l2) return "Labels not found";
            
            const commonParent = l1.parentElement.parentElement; // Expected to be the grid div
            const p1 = l1.parentElement;
            const p2 = l2.parentElement;

            return {
                commonParent: {
                    className: commonParent.className,
                    top: commonParent.getBoundingClientRect().top,
                    display: window.getComputedStyle(commonParent).display,
                    alignItems: window.getComputedStyle(commonParent).alignItems,
                    gap: window.getComputedStyle(commonParent).gap
                },
                p1: {
                    className: p1.className,
                    top: p1.getBoundingClientRect().top,
                    childrenCount: p1.children.length,
                    firstElementChild: p1.firstElementChild.tagName,
                    padding: window.getComputedStyle(p1).padding
                },
                p2: {
                    className: p2.className,
                    top: p2.getBoundingClientRect().top,
                    childrenCount: p2.children.length,
                    firstElementChild: p2.firstElementChild.tagName,
                    padding: window.getComputedStyle(p2).padding
                }
            };
        }''')
        print(json.dumps(structure, indent=2))
        await browser.close()

asyncio.run(run())
