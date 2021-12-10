import { cloneNode, findTextNode } from '@finsweet/ts-utils';
import { queryElement } from '../utils/constants';
import { updateOptionsState } from './state';
import { setOptionAria } from './a11ty';

import type { OptionData, Settings } from '../utils/types';

/**
 * Populates the custom options based on the `HTMLSelectElement`'s options.
 * @param settings The instance {@link Settings}.
 */
export const populateOptions = (settings: Settings) => {
  const {
    optionsStore,
    optionTemplate,
    optionsList,
    selectElement: { value: currentValue, options },
  } = settings;

  // Clear existing options
  for (const { element } of optionsStore.values()) element.remove();

  optionsStore.splice(0, optionsStore.length);

  let selectedOption: OptionData | undefined;

  // Create new options
  for (const { value, text } of options) {
    const element = cloneNode(optionTemplate);

    const textNode = queryElement('text', { operator: 'prefixed', scope: element }) || findTextNode(element);
    if (!textNode) continue;

    setOptionAria(element);

    textNode.textContent = text;

    const labelContent = queryElement<HTMLElement>('labelContent', { operator: 'prefixed', scope: element });

    optionsList.appendChild(element);

    const selected = value === currentValue;

    const optionData: OptionData = {
      value,
      element,
      labelContent,
      selected,
    };

    if (selected) selectedOption = optionData;

    optionsStore.push(optionData);
  }

  updateOptionsState(settings, selectedOption);
};

/**
 * Populates the label with the currently selected option.
 * @param settings The instance {@link Settings}.
 * @param selectedOption The selected {@link OptionData}.
 */
export const populateLabel = ({ label }: Settings, { element, labelContent }: OptionData) => {
  label.innerHTML = labelContent ? labelContent.outerHTML : element.innerHTML;
};
