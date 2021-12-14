import { SLIDER_CSS_CLASSES } from '@finsweet/ts-utils';
import type { SliderElement } from '@finsweet/ts-utils';

import type { CMSList } from '$cms/cmscore/src';

import { ATTRIBUTES, getSelector } from './constants';
import type { PopulateData } from './types';

/**
 * Collects the source lists and the Slider target to populate.
 * @param listInstances An array of {@link CMSList} instances.
 * @returns A {@link PopulateData} array.
 */
export const collectPopulateData = (listInstances: CMSList[]): PopulateData[] => {
  let populateData: PopulateData[] = [];

  for (const listInstance of listInstances) {
    const instanceIndex = listInstance.getInstanceIndex(ATTRIBUTES.element.key);

    // Get the slider target
    const slider = document.querySelector<SliderElement>(
      `.${SLIDER_CSS_CLASSES.slider}${getSelector('element', 'slider', { instanceIndex })}`
    );

    if (!slider) continue;

    // Make sure the populate data exists
    const data = (populateData[instanceIndex || 0] ||= { listInstances: [], slider });

    // Collect the list
    data.listInstances.push(listInstance);
  }

  // Filter out invalid instances
  populateData = populateData.filter((data) => data && data.listInstances.length);

  return populateData;
};
