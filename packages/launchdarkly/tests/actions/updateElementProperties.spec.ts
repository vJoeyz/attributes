import { test, expect } from '@playwright/test';

test.describe('Update Element Properties', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('tests/fixtures/updateElementProperties');
  });

  test.describe('When flag is not set', async () => {
    test('It does not update any property', async ({ page }) => {
      const flags = `{}`;
      await page.evaluate(`fsLaunchDarkly.updateElementProperties(${flags})`);

      const locator = await page.locator('data-test-id=image1');
      const src = await locator.getAttribute('src');
      await expect(src).toEqual('http://example.svg');

      const srcset = await locator.getAttribute('srcset');
      await expect(srcset).toBeNull();

      const sizes = await locator.getAttribute('sizes');
      await expect(sizes).toBeNull();
    });
  });

  test.describe('When flag is set', async () => {
    const srcsetValue = 'http://example2.svg';
    const sizesValue = '100vw';
    const flags = `{testing: { srcset: '${srcsetValue}', sizes: '${sizesValue}'}}`;

    test.beforeEach(async ({ page }) => {
      await page.evaluate(`fsLaunchDarkly.updateElementProperties(${flags})`);
    });

    test('It updates srcset, sizes properties and removes the src attribute', async ({ page }) => {
      const locator = await page.locator('data-test-id=image1');
      const src = await locator.getAttribute('src');
      await expect(src).toBeNull();

      const srcset = await locator.getAttribute('srcset');
      await expect(srcset).toEqual(srcsetValue);

      const sizes = await locator.getAttribute('sizes');
      await expect(sizes).toEqual(sizesValue);
    });
  });
});
