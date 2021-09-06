import { getCollectionElement } from '$utils/cms';
import { WEBFLOW_CSS_CLASSES } from '$utils/webflow';
import { extractNumberSuffix } from '@finsweet/ts-utils';
import { ATTRIBUTES } from './constants';

// Constants  destructuring
const {
  element: { key: elementKey, values: elementValues },
} = ATTRIBUTES;

/**
 * Inits CMS Items count.
 */
export const init = (): void => {
  const listReferences = document.querySelectorAll(`[${elementKey}^="${elementValues.list}"]`);

  for (const listReference of listReferences) {
    const listElement = getCollectionElement(listReference, 'list');
    if (!listElement) continue;

    const elementValue = listElement.getAttribute(elementKey);
    const instanceIndex = elementValue ? extractNumberSuffix(elementValue) : undefined;

    const valueTarget = document.querySelector(`[${elementKey}="${elementValues.value(instanceIndex)}"]`);
    if (!valueTarget) return;

    const collectionItemsCount = listElement.querySelectorAll(`.${WEBFLOW_CSS_CLASSES.collectionItem}`).length;

    valueTarget.textContent = `${collectionItemsCount}`;
  }
};
