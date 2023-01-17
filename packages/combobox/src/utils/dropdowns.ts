import { simulateEvent } from '@finsweet/ts-utils';

import { TABINDEX_KEY } from '$global/constants/a11y';

import type { Settings } from './types';

/**
 * `toggleDropdown()` closes or opens a dropdown element.
 * @param settings A {@link Settings} element.
 * @param focusInputElement Defaults to `true`.
 */
export const toggleDropdown = (settings: Settings) => {
  const { dropdownToggle } = settings;

  simulateEvent(dropdownToggle, ['click', 'mouseup']);
};

/**
 * `toggleDropdownCloseIcon()` handles show/hide state of the dropdown close icon.
 * @param settings A {@link Settings} element.
 */
export const toggleDropdownCloseIcon = (settings: Settings) => {
  const { clearDropdown, inputElement, optionsStore, selectElement } = settings;

  const selectedOption = optionsStore.find(({ value }) => value === selectElement.value);

  if (selectedOption) {
    const selectedText = selectedOption.text.toLowerCase();
    const inputElValue = inputElement.value?.toLowerCase();

    if (!inputElValue) {
      clearDropdown.style.display = 'none';
      return;
    }

    if (inputElValue && inputElValue !== selectedText) {
      clearDropdown.style.display = 'none';
      return;
    }

    clearDropdown.style.display = 'block';

    return;
  }

  clearDropdown.style.display = 'none';
};

/**
 * `focusOnInput()` focuses the input element.
 * @param settings A {@link Settings} element.
 */

export const focusOnInput = (settings: Settings) => {
  const { inputElement } = settings;

  const end = inputElement.value.length;

  inputElement.setSelectionRange(end, end);
  inputElement.focus();
  inputElement.setAttribute(TABINDEX_KEY, '0');
};

/**
 * dispatches custom event `updateComboboxInputField`
 */
export const updateComboboxInputField = (settings: Settings) => {
  const event = new Event('updateComboboxInputField');

  settings.inputElement.dispatchEvent(event);
};
