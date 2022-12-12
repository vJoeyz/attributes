import { cloneNode, findTextNode } from '@finsweet/ts-utils';

import type { OptionData, Settings } from '../utils/types';
import { setOptionAria } from './a11y';
import { updateOptionsState } from './state';

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
  isSearching = false,
  initialLoad = false
) => {
  const {
    optionsStore,
    optionTemplate,
    optionsList,
    label,
    noResultsTemplate,
    selectElement: { options, value: currentValue },
  } = settings;

  // Clear existing options
  noResultsTemplate?.remove();
  for (const { element } of optionsStore.values()) {
    element.remove();
  }

  optionsStore.splice(0, optionsStore.length);

  let selectedOption: OptionData | undefined;

  const optionsListing = Array.from(options).filter((item) =>
    showAll ? item : item.value.trim().toLowerCase().includes(inputValue.toLowerCase().trim())
  );

  if (optionsListing.length === 0 && noResultsTemplate) {
    optionsList.appendChild(noResultsTemplate);

    return;
  }

  // Create new options
  for (const { value, text } of optionsListing) {
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
  if (!isSearching) updateOptionsState(settings, selectedOption);

  if (!inputValue && selectedOption && label) {
    const labelText = label.textContent || '';
    updateOptionsState(settings, { ...selectedOption, value: '', text: labelText }, initialLoad);
  }
};
