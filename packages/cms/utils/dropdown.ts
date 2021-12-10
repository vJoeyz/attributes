import { simulateEvent } from '@finsweet/ts-utils';
import type { DropdownToggle } from '@finsweet/ts-utils';

/**
 * Closes a dropdown.
 * @param dropdownToggle A {@link DropdownToggle} element.
 */
export const closeDropdown = (dropdownToggle: DropdownToggle) => {
  simulateEvent(dropdownToggle, 'mouseup');
  dropdownToggle.focus();
};
