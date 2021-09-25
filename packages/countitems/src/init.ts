import { getCollectionElement } from '$utils/cms';
import { extractNumberSuffix } from '@finsweet/ts-utils';
import { ATTRIBUTES, getSelector } from './constants';

/**
 * Inits list items count.
 */
export const init = (): void => {
  const listReferences = document.querySelectorAll(getSelector('element', 'list', { operator: 'prefixed' }));

  for (const listReference of listReferences) {
    const listElement = getCollectionElement(listReference, 'list') || listReference;

    const elementValue = listReference.getAttribute(ATTRIBUTES.element.key);
    const instanceIndex = elementValue ? extractNumberSuffix(elementValue) : undefined;

    const valueTarget = document.querySelector(getSelector('element', 'value', { instanceIndex }));
    if (!valueTarget) continue;

    const collectionItemsCount = listElement.children.length;

    valueTarget.textContent = `${collectionItemsCount}`;
  }
};
