import { cloneNode, findTextNode } from '@finsweet/ts-utils';
import { toggleDropdownCloseIcon } from 'src/utils';

import { ARIA_HIDDEN_KEY, TABINDEX_KEY } from '$global/constants/a11y';

import type { OptionData, Settings } from '../utils/types';
import { setOptionAria } from './a11y';
import { updateOptionsState } from './state';

let hideCloseIcon = false;

/**
 * Populates the custom options based on the `HTMLSelectElement`'s options.
 * @param settings The instance {@link Settings}.
 * @param {string} inputValue Value from input field.
 * @param {boolean} showAll if dropdown should show all or filtered options.
 * @param {boolean} isTyping user is searching.
 * @param {boolean} initialLoad if dropdown is loaded for the first time.
 */
export const populateOptions = (
  settings: Settings,
  inputValue = '',
  showAll = false,
  isTyping = false,
  initialLoad = false
) => {
  const {
    optionsStore,
    optionTemplate,
    optionsList,
    label,
    noResultsTemplate,
    selectElement,
    clearDropdown,
    inputElement,
    navListElement,
    selectElement: { options, value: currentValue },
  } = settings;

  clearDropdown?.setAttribute(TABINDEX_KEY, '0');
  inputElement?.parentElement?.setAttribute(TABINDEX_KEY, '-1');
  selectElement.setAttribute(ARIA_HIDDEN_KEY, 'true');
  selectElement.setAttribute(TABINDEX_KEY, '-1');
  navListElement.setAttribute(TABINDEX_KEY, '-1');

  // Clear existing options
  noResultsTemplate?.remove();
  for (const { element } of optionsStore.values()) {
    element.remove();
  }

  optionsStore.splice(0, optionsStore.length);

  let selectedOption: OptionData | undefined;

  const optionsConfigured = Array.from(options).filter((item) => item.value && item.textContent);
  const optionsFiltered = optionsConfigured.filter((item) =>
    item.text.trim().toLowerCase().includes(inputValue.trim().toLowerCase())
  );

  if (optionsFiltered.length === 0 && noResultsTemplate) {
    optionsList.appendChild(noResultsTemplate);

    return;
  }

  // Create new options
  for (const { value, text } of showAll ? optionsConfigured : optionsFiltered) {
    const element = cloneNode(optionTemplate) as HTMLAnchorElement;

    const textNode = findTextNode(element) || element;
    textNode.textContent = text;

    setOptionAria(element);

    optionsList.appendChild(element);

    const selected = value === currentValue;

    const optionData: OptionData = {
      text,
      value,
      element,
      selected,
      focused: false,
    };

    if (selected) selectedOption = optionData;

    optionsStore.push(optionData);
  }
  if (isTyping) {
    updateOptionsState(settings, selectedOption);
  }

  if (!inputValue && selectedOption && label) {
    const labelText = label.textContent || '';

    updateOptionsState(settings, { ...selectedOption, value: '', text: labelText }, initialLoad);
  }

  if (!hideCloseIcon) {
    hideCloseIcon = true;

    toggleDropdownCloseIcon(settings, '');
  }
};
