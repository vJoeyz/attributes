import { restartWebflow } from '@finsweet/ts-utils';
import { getSelector } from './constants';
import { populateSliderFromLists } from './populate';
import { mutateSliderMask } from './helpers';
import { importCMSCore } from '$utils/import';

import { collectPopulateData } from './collect';

/**
 * Inits the attribute.
 */
export const init = async (): Promise<void> => {
  const cmsCore = await importCMSCore();
  if (!cmsCore) return;

  const listInstances = cmsCore.createCMSListInstances([getSelector('element', 'list', { operator: 'prefixed' })]);

  // Collect the combine data
  const populateData = collectPopulateData(listInstances);

  // Populate the sliders
  const restoreMaskCallbacks = populateData.map((data) => {
    const { listInstances, slider } = data;

    const createSlidesFromItems = populateSliderFromLists(data);

    // Listen events
    for (const listInstance of listInstances) {
      listInstance.resetIx = true;

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
};
