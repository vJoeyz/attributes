import { expect, test } from '@playwright/test';

import { waitAttributeLoaded } from './utils';

test.beforeEach(async ({ page }) => {
  await page.goto('http://fs-attributes.webflow.io/countitems');
});

test.describe('countitems', () => {
  test('Displays the items count', async ({ page }) => {
    await waitAttributeLoaded(page, 'countitems');

    const value1 = page.getByTestId('value-1');
    const value2 = page.getByTestId('value-2');

    await expect(value1).toHaveText('35');
    await expect(value2).toHaveText('6');
  });
});
