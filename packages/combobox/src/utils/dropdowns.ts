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
 * @param {string} inputValue The value of the input field. Defaults to empty string.
 * @param {string} selectValue The value of the select field. Defaults to empty string.
 */
export const toggleDropdownCloseIcon = (settings: Settings, inputValue = '', selectValue = '') => {
  const { clearDropdown } = settings;
  if (!clearDropdown) return;

  if (!inputValue || !selectValue) {
    clearDropdown.style.display = 'none';
    return;
  }

  if (selectValue) {
    clearDropdown.style.display = 'flex';
    return;
  }
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
