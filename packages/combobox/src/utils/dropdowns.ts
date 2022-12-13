import { simulateEvent } from '@finsweet/ts-utils';
import type { DropdownToggle } from '@finsweet/ts-utils';

import type { Settings } from './types';

/**
 * `toggleDropdown()` closes or opens a dropdown element.
 * @param dropdownToggle A {@link DropdownToggle} element.
 * @param focusInputElement Defaults to `true`.
 */
export const toggleDropdown = (settings: Settings, focusInputElement = true) => {
  const { dropdownToggle, inputElement } = settings;

  if (focusInputElement) inputElement.focus();

  simulateEvent(dropdownToggle, ['click', 'mouseup']);
};
