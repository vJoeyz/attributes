import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://fs-attributes.webflow.io/a11y');
});

test.describe('aria-controls', () => {
  test('Sets correct aria-expanded', async ({ page }) => {
    const header = page.getByTestId('header-1');
    const content = page.getByTestId('content-1');

    await expect(content).toBeHidden();
    await expect(header).toHaveAttribute('aria-expanded', 'false');

    await header.click();
    await expect(content).toBeVisible();
    await expect(header).toHaveAttribute('aria-expanded', 'true');
  });

  test('fs-a11y-element="autofocus" focuses an element', async ({ page }) => {
    const header = page.getByTestId('header-2');
    const content = page.getByTestId('content-2');
    const button = page.getByTestId('button-2');

    await expect(content).toBeHidden();

    await header.click();
    await expect(content).toBeVisible();
    await expect(button).toBeFocused();
  });
});
