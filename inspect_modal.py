import asyncio
import os
import json
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        
        # Get auth info from env
        cookies_json = os.environ.get("LOVABLE_BROWSER_SUPABASE_COOKIES_JSON")
        session_json = os.environ.get("LOVABLE_BROWSER_SUPABASE_SESSION_JSON")
        storage_key = os.environ.get("LOVABLE_BROWSER_SUPABASE_STORAGE_KEY")
        
        context = await browser.new_context(
            viewport={'width': 1280, 'height': 1800}
        )
        
        # Add cookies
        if cookies_json:
            cookies = json.loads(cookies_json)
            for cookie in cookies:
                if 'domain' not in cookie:
                    cookie['domain'] = 'localhost'
                if 'path' not in cookie:
                    cookie['path'] = '/'
            await context.add_cookies(cookies)
        
        page = await context.new_page()
        
        # Navigate to a page on the domain first to set localStorage
        await page.goto("http://localhost:8080/")
        
        if session_json and storage_key:
            print(f"Setting localStorage for {storage_key}")
            await page.evaluate("""([key, val]) => {
                localStorage.setItem(key, val);
            }""", [storage_key, session_json])
        
        # Now go to the target page
        print("Navigating to /portal/account...")
        await page.goto("http://localhost:8080/portal/account", wait_until="networkidle")
        
        # Wait for "Address" row and "Verify" button
        print("Looking for Address row and Verify button...")
        try:
            # Increase timeout and look for specific text
            await page.wait_for_selector("text=Address", timeout=10000)
            # Log all text on page for debugging if it fails
            # print(await page.content())
            
            # Find the row containing "Address" and click the "Verify" button in it
            # The structure might be different, let's try a broader search
            verify_btn = page.locator("button:has-text('Verify')").first
            # We want the one in the Address row. If there are multiple, we might need more logic.
            # But let's assume the user knows there's an Address row.
            
            # Try to find specifically the one near "Address"
            address_verify = page.locator("div").filter(has_text="Address").locator("button:has-text('Verify')").first
            if await address_verify.is_visible():
                await address_verify.click()
            else:
                print("Address-specific Verify button not visible, clicking first Verify button")
                await verify_btn.click()
                
        except Exception as e:
            print(f"Failed to find or click Verify button: {e}")
            # Final fallback
            try:
                await page.get_by_role("button", name="Verify").first.click()
            except:
                print("No Verify button found at all")
                # Save screenshot of what we see
                await page.screenshot(path="/tmp/browser/verify-addr/error_state.png")
                return

        # Wait for modal
        print("Waiting for modal...")
        try:
            await page.wait_for_selector("[role='dialog']", timeout=10000)
        except:
            print("Modal did not appear")
            await page.screenshot(path="/tmp/browser/verify-addr/no_modal.png")
            return
        
        # Take screenshot of the modal
        modal = page.locator("[role='dialog']")
        os.makedirs("/tmp/browser/verify-addr", exist_ok=True)
        screenshot_path = "/tmp/browser/verify-addr/modal.png"
        await modal.screenshot(path=screenshot_path)
        print(f"Screenshot saved to {screenshot_path}")

        # Inspection logic
        results = await page.evaluate('''() => {
            const getBox = (selector, text) => {
                const elements = Array.from(document.querySelectorAll(selector));
                const el = elements.find(e => e.textContent.includes(text));
                if (!el) return null;
                const rect = el.getBoundingClientRect();
                return {
                    text: text,
                    top: rect.top,
                    bottom: rect.bottom,
                    left: rect.left,
                    right: rect.right,
                    height: rect.height,
                    width: rect.width
                };
            };

            const getUnderlineBox = (labelText) => {
                const labels = Array.from(document.querySelectorAll('label'));
                const label = labels.find(l => l.textContent.includes(labelText));
                if (!label) return null;
                
                // Find the nearest input or container that likely has the underline
                // We'll search children of the container of the label
                let container = label.closest('div.grid-cols-2') || label.parentElement;
                // Find input/select/div that looks like an input
                const inputElements = Array.from(container.querySelectorAll('input, select, [class*="input"], [class*="select"]'));
                
                // If label has an 'for' attribute, find that element
                if (label.htmlFor) {
                    const linked = document.getElementById(label.htmlFor);
                    if (linked) {
                        const rect = linked.getBoundingClientRect();
                        return { type: 'linked', bottom: rect.bottom, top: rect.top, id: label.htmlFor };
                    }
                }

                if (inputElements.length > 0) {
                    // Get the one closest to the label horizontal start
                    const rect = inputElements[0].getBoundingClientRect();
                    return { type: 'found', bottom: rect.bottom, top: rect.top };
                }
                
                return null;
            };

            const rows = [
                { l1: "City", l2: "Region" },
                { l1: "Postcode", l2: "Country" },
                { l1: "Document type", l2: "Issue date" }
            ];

            const alignmentData = rows.map(row => {
                const b1 = getBox('label', row.l1);
                const b2 = getBox('label', row.l2);
                
                const u1 = getUnderlineBox(row.l1);
                const u2 = getUnderlineBox(row.l2);

                return {
                    row: `${row.l1} / ${row.l2}`,
                    labels: { 
                        l1: b1 ? {top: b1.top, text: b1.text} : null, 
                        l2: b2 ? {top: b2.top, text: b2.text} : null, 
                        diffTop: b1 && b2 ? b1.top - b2.top : null 
                    },
                    underlines: { 
                        u1: u1 ? {bottom: u1.bottom} : null, 
                        u2: u2 ? {bottom: u2.bottom} : null, 
                        diffBottom: u1 && u2 ? u1.bottom - u2.bottom : null 
                    }
                };
            });

            // Check for horizontal divider line above "Document type"
            const docTypeLabel = Array.from(document.querySelectorAll('label')).find(l => l.textContent.includes("Document type"));
            let dividerFound = false;
            if (docTypeLabel) {
                let rowContainer = docTypeLabel.closest('.grid') || docTypeLabel.parentElement.parentElement;
                let prev = rowContainer.previousElementSibling;
                if (prev) {
                    const style = window.getComputedStyle(prev);
                    const currentStyle = window.getComputedStyle(rowContainer);
                    if (prev.tagName === 'HR' || 
                        style.borderBottomWidth !== '0px' || 
                        currentStyle.borderTopWidth !== '0px') {
                        dividerFound = true;
                    }
                }
            }

            return { alignmentData, dividerFound };
        }''')

        print("RESULT_JSON_START")
        print(json.dumps(results, indent=2))
        print("RESULT_JSON_END")
        
        await browser.close()

asyncio.run(run())
