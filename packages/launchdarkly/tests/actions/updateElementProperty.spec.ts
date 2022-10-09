import { test, expect } from '@playwright/test';

test.describe('Update Element Property', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('tests/fixtures/updateElementProperty');
  });

  test.describe('When flag is not set', async () => {
    test('It does not update the property', async ({ page }) => {
      const flags = `{}`;
      await page.evaluate(`fsLaunchDarkly.updateElementProperty(${flags})`);

      const locator = await page.locator('data-test-id=image1');
      const src = await locator.getAttribute('src');
      await expect(src).toEqual('http://example.svg');
    });
  });

  test.describe('When flag is set', async () => {
    const titleText = 'abc';
    const flags = `{testing: 'http://example2.svg', testing2: '${titleText}'}`;

    test.beforeEach(async ({ page }) => {
      await page.evaluate(`fsLaunchDarkly.updateElementProperty(${flags})`);
    });

    test('It updates src property and removes the srcset attribute', async ({ page }) => {
      const locator = await page.locator('data-test-id=image1');
      const src = await locator.getAttribute('src');
      await expect(src).toEqual('http://example2.svg');

      const srcset = await locator.getAttribute('srcset');
      await expect(srcset).toBeNull();
    });

    test('It updates srcset property and removes the src attribute', async ({ page }) => {
      const locator = await page.locator('data-test-id=image2');
      const srcset = await locator.getAttribute('srcset');
      await expect(srcset).toEqual('http://example2.svg');

      const src = await locator.getAttribute('src');
      await expect(src).toEqual(null);
    });

    test('It sets the innerText of element when "setproperty" attribute is text', async ({ page }) => {
      const locator = await page.locator('data-test-id=text1');
      const textContent = await locator.innerText();
      await expect(textContent).toEqual(titleText);
    });
  });
});
