import { expect, test } from '@playwright/test';

import { waitAttributeLoaded } from './utils';

test.beforeEach(async ({ page }) => {
  await page.goto('http://fs-attributes.webflow.io/copyclip');
});

test.describe('copyclip', () => {
  test('Displays copied message and adds .fs-copyclip_active class', async ({ page }) => {
    await waitAttributeLoaded(page, 'copyclip');

    const button = page.getByTestId('button-1');
    await button.click();

    await expect(button).toHaveText('Copied!');
    await expect(button).toHaveClass(/fs-copyclip_active/);
  });
});
