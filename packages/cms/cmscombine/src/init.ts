import { getCollectionElements, isNotEmpty } from '@finsweet/ts-utils';
import { ATTRIBUTES, getSelector } from './constants';
import { addItemsToList, getCollectionListWrappers } from 'packages/cms/helpers';
import { createCMSListInstance } from 'packages/cms/CMSList';

import type { CMSList } from 'packages/cms/CMSList';

// Types
interface PopulateData {
  lists: CMSList[];
  target: CMSList;
}

/**
 * Inits the attribute.
 */
export const init = async (): Promise<CMSList[]> => {
  let populateData: PopulateData[] = [];

  const collectionListWrappers = getCollectionListWrappers([
    getSelector('element', 'list', { operator: 'prefixed' }),
    getSelector('element', 'target', { operator: 'prefixed' }),
  ]);

  // Collect the combine data
  const listInstances = collectionListWrappers.map(createCMSListInstance).filter(isNotEmpty);

  for (const listInstance of listInstances) {
    const instanceIndex = listInstance.getInstanceIndex(ATTRIBUTES.element.key);

    // Get the target, default to the first list when non-existing
    const targetElement = getCollectionElements(getSelector('element', 'target', { instanceIndex }), 'wrapper');
    const target = listInstances.find(({ wrapper }) => wrapper === targetElement) || listInstance;

    // Make sure the populate data exists
    const data = (populateData[instanceIndex || 0] ||= { lists: [], target });

    if (listInstance !== data.target) data.lists.push(listInstance);
  }

  // Filter out invalid instances
  populateData = populateData.filter((data) => data && data.lists.length);

  // Combine the lists
  const combineLists = await Promise.all(
    populateData.map(async ({ lists, target }) => {
      for (const { wrapper, items } of lists) {
        const elementsToAdd = items.map(({ element }) => element);

        await addItemsToList(target, elementsToAdd);

        wrapper?.remove();
      }

      return target;
    })
  );

  return combineLists;
};
