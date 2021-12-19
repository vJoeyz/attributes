import { restartWebflow } from '@finsweet/ts-utils';

import type { CMSList } from '$cms/cmscore/src';
import { checkCMSCoreVersion } from '$cms/utils/versioning';
import { importCMSCore } from '$global/import/cmscore';

import { collectPopulateData } from './collect';
import { getSelector } from './constants';
import { populateTabsFromLists } from './populate';

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
      // TODO: Remove this check once `cmscore v1.5.5` rolls out
      if (checkCMSCoreVersion('>=', '1.5.5')) listInstance.restartTabs = true;
      else listInstance.restartWebflow = true;

      listInstance.items = [];

      listInstance.on('renderitems', async (renderedItems) => {
        listInstance.items = [];

        createTabsFromItems?.(renderedItems);
      });
    }
  }

  await restartWebflow(['tabs']);

  return listInstances;
};
