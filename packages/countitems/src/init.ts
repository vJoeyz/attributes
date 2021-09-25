import { getCollectionElement } from '$utils/cms';
import { extractNumberSuffix } from '@finsweet/ts-utils';
import { ATTRIBUTES } from './constants';

// Constants  destructuring
const {
  element: { key: elementKey, values: elementValues },
} = ATTRIBUTES;

/**
 * Inits list items count.
 */
export const init = (): void => {
  const listReferences = document.querySelectorAll(`[${elementKey}^="${elementValues.list}"]`);

  for (const listReference of listReferences) {
    const listElement = getCollectionElement(listReference, 'list') || listReference;

    const elementValue = listReference.getAttribute(elementKey);
    const instanceIndex = elementValue ? extractNumberSuffix(elementValue) : undefined;

    const valueTarget = document.querySelector(`[${elementKey}="${elementValues.value(instanceIndex)}"]`);
    if (!valueTarget) continue;

    const collectionItemsCount = listElement.children.length;

    valueTarget.textContent = `${collectionItemsCount}`;
  }
};
