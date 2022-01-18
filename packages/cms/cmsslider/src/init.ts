import { restartWebflow } from '@finsweet/ts-utils';

import type { CMSList } from '$cms/cmscore/src';
import { importCMSCore } from '$global/import/cmscore';

import { collectPopulateData } from './collect';
import { getSelector } from './constants';
import { populateSliderFromLists } from './populate';

/**
 * Inits the attribute.
 */
export const init = async (): Promise<CMSList[]> => {
  const cmsCore = await importCMSCore();
  if (!cmsCore) return [];

  const listInstances = cmsCore.createCMSListInstances([getSelector('element', 'list', { operator: 'prefixed' })]);

  // Collect the combine data
  const populateData = collectPopulateData(listInstances);

  // Populate the sliders
  for (const data of populateData) {
    const { listInstances } = data;

    const createSlidesFromItems = populateSliderFromLists(data);
    if (!createSlidesFromItems) continue;

    // Listen events
    for (const listInstance of listInstances) {
      listInstance.restartSliders = true;
      listInstance.restartIx = true;
      listInstance.items = [];

      listInstance.on('additems', async (newItems) => {
        listInstance.items = [];

        createSlidesFromItems(newItems);
      });
    }
  }

  await restartWebflow(['slider']);

  return listInstances;
};
