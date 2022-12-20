import { simulateEvent } from '@finsweet/ts-utils';

import type { Settings } from './types';

/**
 * `toggleDropdown()` closes or opens a dropdown element.
 * @param settings A {@link Settings} element.
 * @param focusInputElement Defaults to `true`.
 */
export const toggleDropdown = (settings: Settings, focusInputElement = true) => {
  const { dropdownToggle } = settings;

  if (focusInputElement) focusOnInput(settings);

  simulateEvent(dropdownToggle, ['click', 'mouseup']);
};

/**
 * `toggleDropdownCloseIcon()` handles show/hide state of the dropdown close icon.
 * @param settings A {@link Settings} element.
 * @param {string} inputValue The value of the input field. Defaults to empty string.
 */
export const toggleDropdownCloseIcon = (settings: Settings, inputValue = '') => {
  const { clearDropdown } = settings;

  if (!clearDropdown) return;

  const closeIconIsHidden = clearDropdown.style.display === 'none';

  if (inputValue && closeIconIsHidden) {
    clearDropdown.style.display = 'flex';
    return;
  }

  if (!inputValue) {
    clearDropdown.style.display = 'none';
    return;
  }
};

/**
 * `focusOnInput()` focuses the input element.
 * @param settings A {@link Settings} element.
 */

export const focusOnInput = (settings: Settings) => {
  const { inputElement } = settings;

  inputElement.focus();
};

/**
 * dispatches custom event `updateComboboxInputField`
 */
export const updateComboboxInputField = (settings: Settings) => {
  const event = new Event('updateComboboxInputField');

  settings.inputElement.dispatchEvent(event);
};
