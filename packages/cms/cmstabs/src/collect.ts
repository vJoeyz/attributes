import { TABS_CSS_CLASSES } from '@finsweet/ts-utils';
import type { TabsElement } from '@finsweet/ts-utils';

import type { CMSList } from '$cms/cmscore/src';

import { ATTRIBUTES, getSelector } from './constants';
import type { PopulateData } from './types';

/**
 * Collects the source lists and the Tabs target to populate.
 * @param listInstances An array of {@link CMSList} instances.
 * @returns A {@link PopulateData} array.
 */
export const collectPopulateData = (listInstances: CMSList[]): PopulateData[] => {
  let populateData: PopulateData[] = [];

  for (const listInstance of listInstances) {
    const instanceIndex = listInstance.getInstanceIndex(ATTRIBUTES.element.key);

    // Get the slider target
    const tabsElement = document.querySelector<TabsElement>(
      `.${TABS_CSS_CLASSES.tabs}${getSelector('element', 'tabs', { instanceIndex })}`
    );

    if (!tabsElement) continue;

    // Make sure the populate data exists
    const data = (populateData[instanceIndex || 0] ||= { listInstances: [], tabsElement });

    // Collect the list
    data.listInstances.push(listInstance);
  }

  // Filter out invalid instances
  populateData = populateData.filter((data) => data && data.listInstances.length);

  return populateData;
};
