import { DROPDOWN_CSS_CLASSES, findTextNode, isHTMLAnchorElement } from '@finsweet/ts-utils';
import type { Dropdown, DropdownList, DropdownToggle } from '@finsweet/ts-utils';

import { ARIA_CURRENT_KEY, TABINDEX_KEY } from '$global/constants/a11y';

import { ATTRIBUTES, getSelector, queryElement } from '../utils/constants';
import type { OptionsStore } from '../utils/types';
import { setDropdownAria } from './a11y';

/**
 * Collects the required elements/settings for the setup.
 * @param dropdown The {@link Dropdown} element.
 */
export const collectSettings = (referenceElement: HTMLElement) => {
  const optionsStore: OptionsStore = [];

  const dropdown = referenceElement.closest<Dropdown>(`.${DROPDOWN_CSS_CLASSES.dropdown}`);
  if (!dropdown) return;

  const selectElement = dropdown.querySelector('select');
  const inputElement = dropdown.querySelector('input');

  if (!selectElement || !inputElement) return;

  const dropdownToggle = dropdown.querySelector<DropdownToggle>(`.${DROPDOWN_CSS_CLASSES.dropdownToggle}`);
  const dropdownList = dropdown.querySelector<DropdownList>(`.${DROPDOWN_CSS_CLASSES.dropdownList}`);
  if (!dropdownToggle || !dropdownList) return;

  setDropdownAria(dropdownToggle, dropdownList);

  const label =
    queryElement('label', { operator: 'prefixed', scope: dropdownToggle }) ||
    findTextNode(dropdownToggle) ||
    dropdownToggle;

  const optionTemplate = dropdownList.querySelector(
    `a:not(${getSelector('element', 'resetOption', { operator: 'prefixed' })})`
  );
  if (!isHTMLAnchorElement(optionTemplate)) return;

  const optionsList = optionTemplate.parentElement;
  if (!optionsList) return;

  const defaultOption = Array.from(selectElement.querySelectorAll('option')).find((opt) => opt.value === '');

  const noResultsTemplate = queryElement('noResults');
  const clearDropdown = queryElement('clearDropdown');

  for (const element of [optionTemplate]) {
    if (!element) continue;

    element.href = '#';
    element.setAttribute(TABINDEX_KEY, '-1');
    element.removeAttribute(ARIA_CURRENT_KEY);
    element.remove();
  }

  const hideInitial = referenceElement.getAttribute(ATTRIBUTES.hideInitial.key) === ATTRIBUTES.hideInitial.values.true;

  return {
    optionsStore,
    selectElement,
    dropdownToggle,
    dropdownList,
    label,
    optionTemplate,
    noResultsTemplate,
    optionsList,
    hideInitial,
    inputElement,
    clearDropdown,
    defaultOption,
  };
};
