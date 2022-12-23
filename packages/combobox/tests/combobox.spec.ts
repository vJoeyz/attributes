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

  test('Combobox input arrow down key opens dropdown', async ({ page }) => {
    const comboboxDropdown = page.locator('[fs-combobox-element="dropdown"]');
    const comboboxInput = comboboxDropdown.locator('input');
    const comboboxNav = comboboxDropdown.locator('nav');

    await comboboxInput.focus();

    await comboboxInput.press('ArrowDown');

    await expect(comboboxNav).toHaveClass(/w--open/);
  });

  test('Combobox input on escape key if nothing has been selected, it should clear input field and close dropdown', async ({
    page,
  }) => {
    const comboboxDropdown = page.locator('[fs-combobox-element="dropdown"]');
    const comboboxInput = comboboxDropdown.locator('input');
    const comboboxClearDropdown = page.locator('[fs-combobox-element="clear"]');

    const comboboxNav = comboboxDropdown.locator('nav');

    await comboboxInput.focus();
    await comboboxInput.type('test');
    await comboboxInput.dispatchEvent('change');

    await expect(comboboxNav).toHaveClass(/w--open/);

    await comboboxInput.press('Escape');

    await expect(comboboxNav).not.toHaveClass(/w--open/);

    const inputValue = await comboboxInput.inputValue();
    await expect(inputValue).toEqual('');

    await expect(comboboxClearDropdown).toHaveCSS('display', 'none');
  });
  test('Combobox input arrow down key opens dropdown and if selected option exists, it should focus on it', async ({
    page,
  }) => {
    const comboboxDropdown = page.locator('[fs-combobox-element="dropdown"]');
    const comboboxInput = comboboxDropdown.locator('input');
    const comboboxNav = comboboxDropdown.locator('nav');
    const comboboxOptions = comboboxNav.locator('a');
    const select = comboboxDropdown.locator('select');

    await comboboxInput.focus();
    // open dropdown
    await comboboxInput.press('ArrowDown');
    await expect(comboboxNav).toHaveClass(/w--open/);

    // click on random option
    // get random number within 0 and comboboxOptions count
    const randomOptionIndex = Math.floor(Math.random() * (await comboboxOptions.count()));
    const randomOption = comboboxOptions.nth(randomOptionIndex);
    await randomOption.click();

    // expect dropdown to be closed
    await expect(comboboxNav).not.toHaveClass(/w--open/);

    await page.waitForTimeout(200);

    // expect input field to have a value
    const inputValue = await comboboxInput.inputValue();
    await expect(inputValue).not.toEqual('');

    // expect select element to have a value
    const selectValue = await select.inputValue();
    await expect(selectValue).not.toEqual('');

    // get tag name for active element
    const activeElement = await page.evaluate(() => document.activeElement?.tagName);
    await expect(activeElement).toEqual('INPUT');

    // press arrow
    await comboboxInput.press('ArrowDown');
    // expect dropdown to be open
    await expect(comboboxNav).toHaveClass(/w--open/);

    // get index of selected option
    const selectedOptionIndex = await page.evaluate(() => {
      const options = document.querySelectorAll('[fs-combobox-element="dropdown"] nav a');
      const selectedOption = Array.from(options).find((option) => option.classList.contains('w--current'));
      if (selectedOption) {
        return Array.from(options).indexOf(selectedOption);
      }
      return false;
    });

    // random index to equal selected option index
    await expect(randomOptionIndex).toEqual(selectedOptionIndex);

    // comboboxOptions press arrow down
    await comboboxDropdown.press('ArrowDown');

    const selectedOptionId = await page.evaluate(() => document.activeElement?.getAttribute('id'));
    const inputFieldActiveDescendant = await comboboxInput.getAttribute('aria-activedescendant');

    await expect(inputFieldActiveDescendant).toEqual(selectedOptionId);

    await comboboxDropdown.press('ArrowUp');

    const selectedOptionId2 = await page.evaluate(() => document.activeElement?.getAttribute('id'));
    const inputFieldActiveDescendant2 = await comboboxInput.getAttribute('aria-activedescendant');

    expect(inputFieldActiveDescendant2).toEqual(selectedOptionId2);
  });

  test('Combobox should show clear icon only when selected option value matches input value', async ({ page }) => {
    const comboboxDropdown = page.locator('[fs-combobox-element="dropdown"]');
    const comboboxInput = comboboxDropdown.locator('input');
    const comboboxNav = comboboxDropdown.locator('nav');
    const comboboxOptions = comboboxNav.locator('a');
    const comboboxClearDropdown = page.locator('[fs-combobox-element="clear"]');

    await expect(comboboxClearDropdown).toHaveCSS('display', 'none');

    await comboboxInput.click();

    expect(await comboboxNav).toHaveClass(/w--open/);

    const randomOptionIndex = Math.floor(Math.random() * (await comboboxOptions.count()));
    const randomOption = comboboxOptions.nth(randomOptionIndex);
    await randomOption.click();

    await expect(comboboxNav).not.toHaveClass(/w--open/);

    await expect(comboboxClearDropdown).toBeVisible();

    const activeElement = await page.evaluate(() => document.activeElement?.tagName);
    await expect(activeElement).toEqual('INPUT');

    await comboboxInput.press('Backspace');
    await expect(comboboxClearDropdown).toHaveCSS('display', 'none');

    await comboboxInput.press('Backspace');
    await expect(comboboxClearDropdown).toHaveCSS('display', 'none');

    await comboboxInput.fill('');
    await expect(comboboxClearDropdown).toHaveCSS('display', 'none');

    await comboboxInput.press('Escape');
    await expect(comboboxClearDropdown).toHaveCSS('display', 'flex');
  });
});
