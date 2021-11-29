import { getInstanceIndex } from '$utils/attributes';
import { getCollectionElements } from '@finsweet/ts-utils';
import { ATTRIBUTES, getSelector, queryElement } from './constants';

/**
 * Inits list items count.
 */
export const init = (): void => {
  const listReferences = document.querySelectorAll(getSelector('element', 'list', { operator: 'prefixed' }));

  for (const listReference of listReferences) {
    const listElement = getCollectionElements(listReference, 'list') || listReference;

    const instanceIndex = getInstanceIndex(listReference, ATTRIBUTES.element.key);

    const valueTarget = queryElement('value', { instanceIndex });
    if (!valueTarget) continue;

    const collectionItemsCount = listElement.children.length;

    valueTarget.textContent = `${collectionItemsCount}`;
  }
};
