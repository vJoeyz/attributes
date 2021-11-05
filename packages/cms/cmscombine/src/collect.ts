import { getCollectionElements } from '@finsweet/ts-utils';
import { ATTRIBUTES, getSelector } from './constants';

import type { CMSList } from '$cms/cmscore/src';
import type { CombineData } from './types';

/**
 * Collects the Combine Lists + Target.
 * @param listInstances The existing {@link CMSList} instances on the page.
 * @returns A {@link CombineData} array.
 */
export const collectCombineData = (listInstances: CMSList[]): CombineData[] => {
  let populateData: CombineData[] = [];

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

  return populateData;
};
