import { test, expect } from '@playwright/test';

import { showOrHideElement } from '../../src/actions';

test.describe('Show/Hide Element', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('tests/fixtures/showOrHideElement');
    page.exposeBinding('showOrHideElement', showOrHideElement);
  });

  test.describe('Hide Element', async () => {
    test('when flag does not exist', async ({ page }) => {
      const flags = `{}`;
      await page.evaluate(`showOrHideElement(${flags})`);

      const locator = await page.locator('data-test-id=title1');
      await expect(locator).not.toBeVisible();
    });

    test('when flag value is not matched', async ({ page }) => {
      const flags = `{testing:"value"}`;
      await page.evaluate(`showOrHideElement(${flags})`);

      const locator = await page.locator('data-test-id=title1');
      await expect(locator).not.toBeVisible();
    });
  });

  test.describe('Show Element', async () => {
    test('when flag exists and it is equal', async ({ page }) => {
      const flags = `{testing:"value1"}`;
      await page.evaluate(`showOrHideElement(${flags})`);

      const locator = await page.locator('data-test-id=title1');
      await expect(locator).toBeVisible();
    });

    test('when flag exists and it is equal one of the comma separated values', async ({ page }) => {
      const flags = `{testing:"value2"}`;
      await page.evaluate(`showOrHideElement(${flags})`);

      const locator = await page.locator('data-test-id=title2');
      await expect(locator).toBeVisible();
    });

    test('when flag is boolean and fs-launchdarkly-showif="false"', async ({ page }) => {
      const flags = `{testing:false}`;
      await page.evaluate(`showOrHideElement(${flags})`);

      const locator = await page.locator('data-test-id=title-boolean');
      await expect(locator).toBeVisible();
    });
  });
});
