import { restartWebflow } from '@finsweet/ts-utils';
import { ATTRIBUTES, getSelector } from './constants';
import { importCMSCore } from '$utils/import';
import { initRenderAllMode } from './modes/render-all';
import { initInfiniteMode } from './modes/infinite';
import { initDefaultMode } from './modes/default';
import { initPaginateMode } from './modes/paginate';
import { addItemsAnimation, addListAnimation } from '$cms/utils/animation';

import type { CMSList } from '$cms/cmscore/src';

// Types

// Constants
const {
  mode: { key: modeKey, values: modeValues },
  animation: { key: animationKey },
  duration: { key: durationKey },
  easing: { key: easingKey },
  stagger: { key: staggerKey },
  resetIx: { key: resetIxKey, values: resetIxValues },
} = ATTRIBUTES;

/**
 * Inits the attribute.
 */
export const init = async (): Promise<CMSList[]> => {
  const cmsCore = await importCMSCore();
  if (!cmsCore) return [];

  // Create the list instances
  const listInstances = cmsCore.createCMSListInstances([getSelector('element', 'list', { operator: 'prefixed' })]);

  // Init the modes
  await Promise.all(listInstances.map(initInstance));

  return listInstances;
};

/**
 * Inits a load mode for a `CMSList` instance.
 * @param listInstance The {@link CMSList} instance.
 * @returns The same instance.
 */
const initInstance = async (listInstance: CMSList) => {
  // Animation
  addItemsAnimation(listInstance, { animationKey, durationKey, easingKey, staggerKey });

  if (!listInstance.listAnimation) addListAnimation(listInstance, { durationKey, easingKey });

  // Get resetIx config
  const resetIx = listInstance.getAttribute(resetIxKey) === resetIxValues.true;

  if (resetIx) {
    listInstance.on('additems', async () => {
      await restartWebflow();
    });
  }

  // Get mode config
  const mode = listInstance.getAttribute(modeKey);

  // Init mode
  if (mode === modeValues.renderAll) await initRenderAllMode(listInstance);
  else if (mode === modeValues.infinite) initInfiniteMode(listInstance);
  else if (mode === modeValues.pagination) await initPaginateMode(listInstance);
  else initDefaultMode(listInstance);

  return listInstance;
};
