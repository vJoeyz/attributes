import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://fs-attributes.webflow.io/component');
});

test.describe('component', () => {
  test('Loads same-project components', async ({ page }) => {
    await page.evaluate(async () => new Promise((resolve) => window.fsAttributes.push(['component', resolve])));

    const target1 = page.getByTestId('target-1');
    const target2 = page.getByTestId('target-2');

    await expect(target1).not.toBeEmpty();
    await expect(target2).not.toBeEmpty();
  });

  test('Loads external-project components', async ({ page }) => {
    await page.evaluate(async () => new Promise((resolve) => window.fsAttributes.push(['component', resolve])));

    const target3 = page.getByTestId('target-3');
    const target4 = page.getByTestId('target-4');

    // Components are rendered
    const target3Component = target3.locator('[fs-component-id]');
    const target4Component = target4.locator('[fs-component-id]');

    await expect(target3Component).toBeVisible();
    await expect(target4Component).toBeVisible();

    // External CSS is loaded
    const target3CSS = target3.locator('link');

    await expect(target3CSS).toHaveCount(1);
  });
});
