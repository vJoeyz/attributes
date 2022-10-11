import { test, expect } from '@playwright/test';

const selectElement = (selector: string) => `document.querySelector('${selector}')`;

test.describe('Update Element Property', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('tests/fixtures/setProperties');
  });

  test.describe('When flag is not set', async () => {
    test('It does not update the property', async ({ page }) => {
      const flags = `{}`;
      const selector = '[data-test-id="image1"]';
      await page.evaluate(`fsLaunchDarkly.initFlagElement(${selectElement(selector)}, ${flags})`);

      const locator = await page.locator(selector);
      const src = await locator.getAttribute('src');
      await expect(src).toEqual('http://example.svg');
    });
  });

  test.describe('When flag is set', async () => {
    const titleText = 'abc';
    const flags = `{testing: 'http://example2.svg', testing2: '${titleText}'}`;
    let selector: string;

    test('It updates src property and removes the srcset attribute', async ({ page }) => {
      selector = '[data-test-id="image1"]';
      await page.evaluate(`fsLaunchDarkly.initFlagElement(${selectElement(selector)}, ${flags})`);

      const locator = await page.locator(selector);
      const src = await locator.getAttribute('src');
      await expect(src).toEqual('http://example2.svg');

      const srcset = await locator.getAttribute('srcset');
      await expect(srcset).toBeNull();
    });

    test('It updates srcset property and removes the src attribute', async ({ page }) => {
      selector = '[data-test-id="image2"]';
      await page.evaluate(`fsLaunchDarkly.initFlagElement(${selectElement(selector)}, ${flags})`);

      const locator = await page.locator(selector);
      const srcset = await locator.getAttribute('srcset');
      await expect(srcset).toEqual('http://example2.svg');

      const src = await locator.getAttribute('src');
      await expect(src).toEqual(null);
    });

    test('It sets the innerText of element when "setproperty" attribute is text', async ({ page }) => {
      selector = '[data-test-id="text1"]';
      await page.evaluate(`fsLaunchDarkly.initFlagElement(${selectElement(selector)}, ${flags})`);

      const locator = await page.locator('data-test-id=text1');
      const textContent = await locator.innerText();
      await expect(textContent).toEqual(titleText);
    });
  });
});
