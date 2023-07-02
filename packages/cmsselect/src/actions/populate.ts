import { type CMSList, createCMSListInstance } from '@finsweet/attributes-cmscore';
import { type CollectionListWrapperElement, getCMSElementSelector } from '@finsweet/attributes-utils';

import { getInstanceIndex, queryAllElements } from '../utils/selectors';

/**
 * Populates a Select element's options based on the source values.
 * @param selectElement
 */
export const populateSelectElement = (selectElement: HTMLSelectElement) => {
  const instanceIndex = getInstanceIndex(selectElement);
  const displaySources = queryAllElements('text-value', { instanceIndex });

  const listInstances: Set<CMSList> = new Set();
  const optionsMemo: Set<string> = new Set();

  for (const displaySource of displaySources) {
    addSelectOption(selectElement, displaySource, optionsMemo);

    const collectionListWrapper = displaySource.closest<CollectionListWrapperElement>(getCMSElementSelector('wrapper'));
    if (!collectionListWrapper) continue;

    const listIntance = createCMSListInstance(collectionListWrapper);
    if (!listIntance) continue;

    listInstances.add(listIntance);
  }

  for (const listInstance of listInstances) {
    listInstance.on('additems', (addedItems) => {
      for (const { element } of addedItems) {
        const displaySources = queryAllElements('text-value', { instanceIndex, scope: element });

        for (const displaySource of displaySources) {
          addSelectOption(selectElement, displaySource, optionsMemo);
        }
      }
    });
  }

  return [...listInstances];
};

/**
 * Adds a new <option> to the <select> element using a displaySource's text.
 * @param selectElement
 * @param displaySource
 * @param optionsMemo
 */
const addSelectOption = (selectElement: HTMLSelectElement, { innerText }: HTMLElement, optionsMemo: Set<string>) => {
  if (!innerText || optionsMemo.has(innerText)) return;

  const newOption = new Option(innerText, innerText);
  selectElement.options.add(newOption);
  optionsMemo.add(innerText);
};
