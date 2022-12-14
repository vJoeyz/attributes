import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://fs-attributes.webflow.io/combobox');
});

test.describe('combobox', () => {
  test('Combobox initializes properly', async ({ page }) => {
    const comboboxDropdown = page.locator('[fs-combobox-element="dropdown"]');
    const comboboxClearDropdown = page.locator('[fs-combobox-element="clear"]');
    const comboboxArrowDown = page.locator('[fs-combobox-element="arrow"]');
    const comboboxLabels = page.locator('[fs-combobox-element="label"]');
    const comboboxInput = comboboxDropdown.locator('input');
    const comboboSelect = comboboxDropdown.locator('select');
    const comboboSelectOptions = comboboSelect.locator('option');

    const comboboxLabelsCount = await comboboxLabels.count();
    const comboboSelectOptionsCount = await comboboSelectOptions.count();

    for (let optionIndex = 0; optionIndex < comboboSelectOptionsCount; optionIndex++) {
      const option = comboboSelect.nth(optionIndex);
      await expect(option).not.toBe(null);
    }

    await expect(comboboxLabelsCount).toBeGreaterThan(0);

    await expect(comboboxDropdown).toBeVisible();
    await expect(comboboxClearDropdown).toHaveCSS('display', 'none');
    await expect(comboboxArrowDown).toBeVisible();
    await expect(comboboxInput).toBeVisible();
    await expect(comboboxInput).toBeEditable();
  });

  test('Combobox opens and closes by clicking on arrow.', async ({ page }) => {
    const comboboxDropdown = page.locator('[fs-combobox-element="dropdown"]');
    const comboboxArrowDown = page.locator('[fs-combobox-element="arrow"]');

    const comboboxNav = comboboxDropdown.locator('nav');

    // open dropdown
    await comboboxArrowDown.click();
    await page.waitForTimeout(300);
    await expect(comboboxNav).toHaveClass(/w--open/);

    // close dropdown
    await comboboxArrowDown.click();
    await page.waitForTimeout(300);
    await expect(comboboxNav).not.toHaveClass(/w--open/);
  });

  test('Combobox opens and closes by clicking on input.', async ({ page }) => {
    const comboboxDropdown = page.locator('[fs-combobox-element="dropdown"]');
    const comboboxInput = comboboxDropdown.locator('input');

    const comboboxNav = comboboxDropdown.locator('nav');

    // open dropdown
    await comboboxInput.click();
    await page.waitForTimeout(300);
    // expect nav class to include w--open
    await expect(comboboxNav).toHaveClass(/w--open/);

    // close dropdown
    await comboboxInput.click();
    await page.waitForTimeout(300);
    await expect(comboboxNav).not.toHaveClass(/w--open/);
  });
});
