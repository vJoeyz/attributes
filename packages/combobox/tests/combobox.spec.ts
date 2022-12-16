import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://fs-attributes.webflow.io/combobox');
  page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));
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

  test('Combobox input can accept input and escape key closes dropdown.', async ({ page }) => {
    const comboboxDropdown = page.locator('[fs-combobox-element="dropdown"]');
    const comboboxInput = comboboxDropdown.locator('input');
    const comboboxLabels = page.locator('[fs-combobox-element="label"]');
    const comboboxCount = await comboboxLabels.count();
    const comboboxNav = comboboxDropdown.locator('nav');

    const randomLabel = comboboxLabels.nth(Math.floor(Math.random() * comboboxCount));
    const randomLabelText = await randomLabel.textContent();

    if (randomLabelText) {
      await comboboxInput.focus();
      await await comboboxInput.type(randomLabelText);

      const inputValue = await comboboxInput.inputValue();
      await expect(inputValue).toEqual(randomLabelText);

      await expect(comboboxNav).toHaveClass(/w--open/);

      await page.keyboard.press('Escape');

      await expect(comboboxNav).not.toHaveClass(/w--open/);
    }
  });
  test('Combobox input arrow down key opens dropdown', async ({ page }) => {
    const comboboxDropdown = page.locator('[fs-combobox-element="dropdown"]');
    const comboboxInput = comboboxDropdown.locator('input');
    const comboboxNav = comboboxDropdown.locator('nav');

    await comboboxInput.focus();

    await comboboxInput.press('ArrowDown');

    await expect(comboboxNav).toHaveClass(/w--open/);
  });
});
