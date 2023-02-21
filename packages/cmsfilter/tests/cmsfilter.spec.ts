import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://fs-attributes.webflow.io/cmsfilter');
});

test.describe('cmsfilter', () => {
  test('Sorts correctly', async ({ page }) => {
    await page.evaluate(async () => new Promise((resolve) => window.fsAttributes.push(['cmsfilter', resolve])));
  });

  test('Change reset button attribute value from reset to clear is backward compatible', async ({ page }) => {
    const clearButtons = page.locator('[fs-cmsfilter-element="clear"]');
    const resetButtons = page.locator('[fs-cmsfilter-element="reset"]');

    const countClearButtons = await clearButtons.count();
    const countResetButtons = await resetButtons.count();

    const eitherIsGreaterThanZero = countClearButtons > 0 || countResetButtons > 0;

    expect(eitherIsGreaterThanZero).toBe(true);
  });
});
