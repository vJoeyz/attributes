import { getInstanceIndex } from '$global/helpers/instances';

import { ATTRIBUTES, getSelector } from './constants';

/**
 * Populates a Select element's options based on the source values.
 * @param selectElement
 */
export const populateSelectElement = (selectElement: HTMLSelectElement) => {
  const instanceIndex = getInstanceIndex(selectElement, ATTRIBUTES.element.key);

  const displaySources = document.querySelectorAll<HTMLElement>(getSelector('element', 'textValue', { instanceIndex }));
  if (!displaySources.length) return;

  for (const displaySource of displaySources) {
    const { innerText } = displaySource;
    if (!innerText) continue;

    const newOption = new Option(innerText, innerText);
    selectElement.options.add(newOption);
  }
};
