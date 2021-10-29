import { restartWebflow } from '@finsweet/ts-utils';
import { ATTRIBUTES, getSelector } from './constants';
import { importCMSCore } from '$utils/import';
import { initLoadAllMode } from './modes/load-all';
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
  await Promise.all(
    listInstances.map(async (listInstance) => {
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
      if (mode === modeValues.loadAll) await initLoadAllMode(listInstance);
      else if (mode === modeValues.infinite) initInfiniteMode(listInstance);
      else if (mode === modeValues.paginate) initPaginateMode(listInstance);
      else initDefaultMode(listInstance);

      return listInstance;
    })
  );

  return listInstances;
};
