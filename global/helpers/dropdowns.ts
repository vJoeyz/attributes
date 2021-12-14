import { simulateEvent } from '@finsweet/ts-utils';

import type { DropdownToggle } from '@finsweet/ts-utils';

/**
 * Closes a dropdown.
 * @param dropdownToggle A {@link DropdownToggle} element.
 * @param focusToggle Defaults to `true`.
 */
export const closeDropdown = (dropdownToggle: DropdownToggle, focusToggle = true) => {
  if (focusToggle) dropdownToggle.focus();

  simulateEvent(dropdownToggle, ['click', 'mouseup']);
};
