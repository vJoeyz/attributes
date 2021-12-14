import { restartWebflow } from '@finsweet/ts-utils';

import type { CMSList } from '$cms/cmscore/src';
import { importCMSCore } from '$global/import/cmscore';

import { collectPopulateData } from './collect';
import { getSelector } from './constants';
import { mutateSliderMask } from './helpers';
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
  const restoreMaskCallbacks = populateData.map((data) => {
    const { listInstances, slider } = data;

    const createSlidesFromItems = populateSliderFromLists(data);

    // Listen events
    for (const listInstance of listInstances) {
      listInstance.restartWebflow = true;

      listInstance.items = [];

      let restoreMask: (() => void) | undefined;

      listInstance.on('renderitems', (newItems) => {
        listInstance.items = [];

        createSlidesFromItems?.(newItems);

        restoreMask = mutateSliderMask(slider);
      });

      listInstance.on('additems', async () => {
        restoreMask?.();
        restoreMask = undefined;
      });
    }

    return mutateSliderMask(slider);
  });

  await restartWebflow();

  // Remove the Masks mutations
  for (const restoreMaskCallback of restoreMaskCallbacks) restoreMaskCallback();

  return listInstances;
};
