import { chromium } from 'playwright';

async function main() {
  const storageKey = process.env.LOVABLE_BROWSER_SUPABASE_STORAGE_KEY;
  const sessionJson = process.env.LOVABLE_BROWSER_SUPABASE_SESSION_JSON;

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('http://localhost:8080/');
  await page.evaluate(({ key, session }) => {
    window.localStorage.setItem(key, session);
  }, { key: storageKey, session: sessionJson });

  await page.goto('http://localhost:8080/portal/account');
  await page.waitForTimeout(2000);

  const viewports = [
    { name: '390x756', width: 390, height: 756 },
    { name: '768x1024', width: 768, height: 1024 },
    { name: '1280x900', width: 1280, height: 900 },
  ];

  for (const vp of viewports) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.waitForTimeout(300);

    const verifyBtn = page.locator('button:has-text("Verify")').first();
    if (await verifyBtn.count()) {
      await verifyBtn.click();
      await page.waitForTimeout(400);
      const content = page.locator('[role="dialog"]').first();
      if (await content.count()) {
        const metrics = await content.evaluate(el => ({ sh: el.scrollHeight, ch: el.clientHeight }));
        console.log(`VerifyAddressDialog @ ${vp.name}: scrollHeight=${metrics.sh} clientHeight=${metrics.ch} scrolls=${metrics.sh > metrics.ch + 2}`);
        await page.screenshot({ path: `/tmp/browser/modal-check/verify-address-${vp.name}.png` });
      } else {
        console.log(`No dialog found for verify at ${vp.name}`);
      }
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);
    } else {
      console.log(`No Verify button found at ${vp.name}`);
    }

    const editBtn = page.locator('button:has-text("Edit")').first();
    if (await editBtn.count()) {
      await editBtn.click();
      await page.waitForTimeout(400);
      const addressTab = page.locator('button:has-text("Address")');
      if (await addressTab.count()) {
        await addressTab.click();
        await page.waitForTimeout(300);
      }
      const content = page.locator('[role="dialog"]').first();
      if (await content.count()) {
        const metrics = await content.evaluate(el => ({ sh: el.scrollHeight, ch: el.clientHeight }));
        console.log(`EditProfileDialog(Address) @ ${vp.name}: scrollHeight=${metrics.sh} clientHeight=${metrics.ch} scrolls=${metrics.sh > metrics.ch + 2}`);
        await page.screenshot({ path: `/tmp/browser/modal-check/edit-address-${vp.name}.png` });
      } else {
        console.log(`No dialog found for edit at ${vp.name}`);
      }
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);
    } else {
      console.log(`No Edit button found at ${vp.name}`);
    }
  }

  await browser.close();
}

main().catch(e => { console.error(e); process.exit(1); });
