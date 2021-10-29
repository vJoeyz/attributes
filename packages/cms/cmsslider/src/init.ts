import { restartWebflow, SLIDER_CSS_CLASSES } from '@finsweet/ts-utils';
import { ATTRIBUTES, getSelector } from './constants';
import { populateSliderFromLists } from './populate';
import { mutateSliderMask } from './helpers';
import { importCMSCore } from '$utils/import';

import type { SliderElement } from '@finsweet/ts-utils';
import type { CMSList } from 'packages/cms/cmscore/src';

// Types
export interface PopulateData {
  listInstances: CMSList[];
  slider: SliderElement;
}

/**
 * Inits the attribute.
 *
 * Auto init:
 * @param params The current `<script>` element.
 *
 * Programatic init:
 * @param params.param A global parameter.
 */
export const init = async (): Promise<void> => {
  const cmsCore = await importCMSCore();
  if (!cmsCore) return;

  const listInstances = cmsCore.createCMSListInstances([getSelector('element', 'list', { operator: 'prefixed' })]);

  // Collect the combine data
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

  // Populate the sliders
  const restoreMaskCallbacks = populateData.map((data) => {
    const { listInstances, slider } = data;

    const createSlidesFromItems = populateSliderFromLists(data);

    // Listen events
    for (const listInstance of listInstances) {
      listInstance.on('additems', (newItems) => {
        createSlidesFromItems?.(newItems);
      });

      listInstance.on('finishload', async () => {
        const restoreMask = mutateSliderMask(slider);

        await restartWebflow();

        restoreMask();
      });
    }

    return mutateSliderMask(slider);
  });

  await restartWebflow();

  // Remove the Masks mutations
  for (const restoreMaskCallback of restoreMaskCallbacks) restoreMaskCallback();
};
