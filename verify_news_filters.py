import asyncio
import os
import json
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context(viewport={'width': 1280, 'height': 1800})
        
        storage_key = os.environ.get('LOVABLE_BROWSER_SUPABASE_STORAGE_KEY')
        session_json = os.environ.get('LOVABLE_BROWSER_SUPABASE_SESSION_JSON')
        cookies_json = os.environ.get('LOVABLE_BROWSER_SUPABASE_COOKIES_JSON')
        
        page = await context.new_page()
        
        if storage_key and session_json:
            await page.add_init_script(f"""
                window.localStorage.setItem('{storage_key}', '{session_json}');
            """)

        if cookies_json:
            try:
                cookies = json.loads(cookies_json)
                valid_cookies = []
                for cookie in cookies:
                    # Playwright is picky about cookie fields
                    c = {
                        'name': cookie['name'],
                        'value': cookie['value'],
                        'domain': 'localhost',
                        'path': '/'
                    }
                    valid_cookies.append(c)
                await context.add_cookies(valid_cookies)
            except Exception as e:
                print(f"Error setting cookies: {e}")

        await page.goto('http://localhost:8080/portal/news', wait_until="load")
        
        # Give it a moment to load components
        await page.wait_for_timeout(2000)

        # Wait for the elements to be present
        try:
            await page.wait_for_selector('#portal-news-search', timeout=15000)
        except:
            print(f"Failed to find #portal-news-search. URL: {page.url}")
            await page.screenshot(path='/tmp/browser/portalnews_error.png')
            # Log body content for debugging
            content = await page.content()
            print(f"Content length: {len(content)}")
            if "Login" in content:
                print("Redirected to Login page despite session.")
            await browser.close()
            return

        controls = [
            ('input#portal-news-search', 'Search Input'),
            ('select#portal-news-category', 'Category Select'),
            ('select#portal-news-sort', 'Sort Select')
        ]
        
        results = []
        os.makedirs('/tmp/browser/portalnews/screenshots', exist_ok=True)
        
        for selector, name in controls:
            element = await page.query_selector(selector)
            if element:
                style = await element.evaluate('''
                    (el) => {
                        const s = window.getComputedStyle(el);
                        return {
                            backgroundColor: s.backgroundColor,
                            border: s.border
                        };
                    }
                ''')
                
                is_pass = style['backgroundColor'] == 'rgb(255, 255, 255)'
                results.append({
                    'name': name,
                    'selector': selector,
                    'backgroundColor': style['backgroundColor'],
                    'border': style['border'],
                    'pass': is_pass
                })
            else:
                results.append({
                    'name': name,
                    'selector': selector,
                    'error': 'Element not found',
                    'pass': False
                })

        # Find the container of the filters
        filter_row = await page.query_selector('.flex.flex-col.md\\:flex-row.gap-4')
        if not filter_row:
             filter_row = await page.query_selector('.flex.gap-4')
        if not filter_row:
             search_input = await page.query_selector('#portal-news-search')
             if search_input:
                 filter_row = await page.evaluate_handle('el => el.closest("div.flex") || el.parentElement', search_input)
        
        if filter_row:
            await filter_row.screenshot(path='/tmp/browser/portalnews/screenshots/filter_row.png')
        else:
            await page.screenshot(path='/tmp/browser/portalnews/screenshots/filter_row_fallback.png')

        for res in results:
            if 'error' in res:
                print(f"{res['name']} ({res['selector']}): {res['error']} - FAIL")
            else:
                status = "PASS" if res['pass'] else "FAIL"
                print(f"{res['name']} ({res['selector']}):")
                print(f"  Background Color: {res['backgroundColor']}")
                print(f"  Border: {res['border']}")
                print(f"  Result: {status}")

        await browser.close()

if __name__ == '__main__':
    asyncio.run(run())
