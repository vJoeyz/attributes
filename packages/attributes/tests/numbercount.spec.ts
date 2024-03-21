/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { expect, test } from '@playwright/test';

import { waitAttributeLoaded } from './utils';

test.beforeEach(async ({ page }) => {
  await page.goto('http://fs-attributes.webflow.io/numbercount');
});

test.describe('Animates the numbers', () => {
  test('Picks the end value and duration and animates it', async ({ page }) => {
    await waitAttributeLoaded(page, 'numbercount');

    const numberElement = page.getByTestId('number-1');
    const rawEnd = (await numberElement.getAttribute('fs-numbercount-end'))!;
    const rawDuration = await numberElement.getAttribute('fs-numbercount-duration');

    const duration = Number(rawDuration);

    await page.waitForTimeout(duration);

    await expect(numberElement).toHaveText(rawEnd);
  });

  test('Formats numbers using a locale', async ({ page }) => {
    await waitAttributeLoaded(page, 'numbercount');

    const numberElement = page.getByTestId('number-2');
    const rawEnd = (await numberElement.getAttribute('fs-numbercount-end'))!;
    const rawDuration = await numberElement.getAttribute('fs-numbercount-duration');
    const locale = (await numberElement.getAttribute('fs-numbercount-locale'))!;

    const duration = Number(rawDuration);
    const end = Number(rawEnd);

    await page.waitForTimeout(duration);

    await expect(numberElement).toHaveText(end.toLocaleString(locale));
  });
});
