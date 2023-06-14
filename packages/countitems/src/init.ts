import { awaitWebflowReady, type FsAttributeInit, getCollectionElements } from '@finsweet/attributes-utils';

import { getInstanceIndex, queryAllElements, queryElement } from './utils/selectors';

/**
 * Inits list items count.
 */
export const init: FsAttributeInit = async () => {
  await awaitWebflowReady();

  const listReferences = queryAllElements('list');

  for (const listReference of listReferences) {
    const listElement = getCollectionElements(listReference, 'list') || listReference;

    const instanceIndex = getInstanceIndex(listReference);

    const valueTarget = queryElement('value', { instanceIndex });
    if (!valueTarget) continue;

    const collectionItemsCount = listElement.children.length;

    valueTarget.textContent = `${collectionItemsCount}`;
  }

  return {
    result: listReferences,
  };
};
