import { test, expect } from '@playwright/test';

const elements = `fsLaunchDarkly.extractElementsByCategory().showOrHideElements`;

test.describe('Show/Hide Element', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('tests/fixtures/showOrHideElement');
  });

  test.describe('Hide Element', async () => {
    test('when flag does not exist', async ({ page }) => {
      const flags = `{}`;
      await page.evaluate(`fsLaunchDarkly.showOrHideElement(${elements}, ${flags})`);

      const locator = await page.locator('data-test-id=title1');
      await expect(locator).not.toBeVisible();
    });

    test('when flag value is not matched', async ({ page }) => {
      const flags = `{testing:"value"}`;
      await page.evaluate(`fsLaunchDarkly.showOrHideElement(${elements}, ${flags})`);

      const locator = await page.locator('data-test-id=title1');
      await expect(locator).not.toBeVisible();
    });
  });

  test.describe('Show Element', async () => {
    test('when flag exists and it is equal', async ({ page }) => {
      const flags = `{testing:"value1"}`;
      await page.evaluate(`fsLaunchDarkly.showOrHideElement(${elements}, ${flags})`);

      const locator = await page.locator('data-test-id=title1');
      await expect(locator).toBeVisible();
    });

    test('when flag exists and it is equal one of the comma separated values', async ({ page }) => {
      const flags = `{testing:"value2"}`;
      await page.evaluate(`fsLaunchDarkly.showOrHideElement(${elements}, ${flags})`);

      const locator = await page.locator('data-test-id=title2');
      await expect(locator).toBeVisible();
    });

    test('when flag is boolean and fs-launchdarkly-showif="false"', async ({ page }) => {
      const flags = `{testing:false}`;
      await page.evaluate(`fsLaunchDarkly.showOrHideElement(${elements}, ${flags})`);

      const locator = await page.locator('data-test-id=title-boolean');
      await expect(locator).toBeVisible();
    });

    // test('when flag is json and only flag name is provided', async ({ page }) => {
    //   const flags = `{testing:{title:"value1"}}`;
    //   await page.evaluate(`fsLaunchDarkly.showOrHideElement(${flags})`);
    //
    //   const locator = await page.locator('data-test-id=img-json');
    //   await expect(locator).toBeVisible();
    // });
  });
});
