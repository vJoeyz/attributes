import { DROPDOWN_CSS_CLASSES } from '@finsweet/ts-utils';
import { queryElement } from '../utils/constants';

import type { Dropdown, DropdownList, DropdownToggle } from '@finsweet/ts-utils';
import type { OptionsStore } from '../utils/types';

/**
 * Collects the required elements/settings for the setup.
 * @param dropdown The {@link Dropdown} element.
 */
export const collectSettings = (dropdown: Dropdown) => {
  const selectElement = dropdown.querySelector('select');
  if (!selectElement) return;

  const dropdownToggle = dropdown.querySelector<DropdownToggle>(`.${DROPDOWN_CSS_CLASSES.dropdownToggle}`);
  const dropdownList = dropdown.querySelector<DropdownList>(`.${DROPDOWN_CSS_CLASSES.dropdownList}`);
  if (!dropdownToggle || !dropdownList) return;

  const label = queryElement<HTMLElement>('label', { operator: 'prefixed', scope: dropdownToggle }) || dropdownToggle;

  const optionTemplate =
    queryElement<HTMLElement>('optionTemplate', { operator: 'prefixed', scope: dropdownList }) ||
    dropdownList.querySelector('a');
  if (!(optionTemplate instanceof HTMLAnchorElement)) return;

  const optionsList = optionTemplate.parentElement;
  if (!optionsList) return;

  optionTemplate.remove();

  const optionsStore: OptionsStore = [];

  return {
    optionsStore,
    selectElement,
    dropdownToggle,
    dropdownList,
    label,
    optionTemplate,
    optionsList,
  };
};
