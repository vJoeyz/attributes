import { getSelector } from './constants';
import { restartWebflow } from '@finsweet/ts-utils';
import { populateTabsFromLists } from './populate';
import { importCMSCore } from '$utils/import';
import { collectPopulateData } from './collect';

import type { CMSList } from '$cms/cmscore/src';

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

    const createTabsFromItems = populateTabsFromLists(data);

    // Listen events
    for (const listInstance of listInstances) {
      listInstance.restartWebflow = true;

      listInstance.items = [];

      listInstance.on('renderitems', async (renderedItems) => {
        listInstance.items = [];

        createTabsFromItems?.(renderedItems);
      });
    }
  }

  await restartWebflow();

  return listInstances;
};
