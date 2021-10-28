import { getCollectionElements } from '@finsweet/ts-utils';
import { ATTRIBUTES, getSelector } from './constants';
import { importCMSCore } from '$utils/import';

import type { CMSList } from 'packages/cms/cmscore/src';

// Types
interface PopulateData {
  lists: CMSList[];
  target: CMSList;
}

/**
 * Inits the attribute.
 */
export const init = async (): Promise<CMSList[]> => {
  const cmsCore = await importCMSCore();
  if (!cmsCore) return [];

  let populateData: PopulateData[] = [];

  const listInstances = cmsCore.createCMSListInstances([
    getSelector('element', 'list', { operator: 'prefixed' }),
    getSelector('element', 'target', { operator: 'prefixed' }),
  ]);

  // Collect the combine data
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

        await target.addItems(elementsToAdd);

        wrapper.remove();
      }

      return target;
    })
  );

  return combineLists;
};
