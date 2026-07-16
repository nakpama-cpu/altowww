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

        css_info = await page.evaluate('''() => {
            const getInfo = (text) => {
                const el = Array.from(document.querySelectorAll('label')).find(l => l.textContent.includes(text));
                if (!el) return null;
                const style = window.getComputedStyle(el);
                const rect = el.getBoundingClientRect();
                return {
                    text: text,
                    top: rect.top,
                    height: rect.height,
                    padding: style.padding,
                    margin: style.margin,
                    lineHeight: style.lineHeight,
                    fontSize: style.fontSize,
                    display: style.display,
                    verticalAlign: style.verticalAlign,
                    tagName: el.tagName,
                    classes: el.className
                };
            };
            return {
                docType: getInfo("Document type"),
                issueDate: getInfo("Issue date")
            };
        }''')
        print(json.dumps(css_info, indent=2))
        await browser.close()

asyncio.run(run())
