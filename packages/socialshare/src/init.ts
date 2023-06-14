import type { CMSList } from '@finsweet/attributes-cmscore';
import { awaitAttributeLoaded, awaitWebflowReady, type FsAttributeInit } from '@finsweet/attributes-utils';

import { listenTriggerClicks } from './actions/trigger';
import { createSocialShareInstances } from './factory';
import { stores } from './utils/stores';

/**
 * Inits the attribute.
 */
export const init: FsAttributeInit = async () => {
  await awaitWebflowReady();

  // Init global click listener
  const removeClickListener = listenTriggerClicks();

  // create button for static items
  createSocialShareInstances();

  // create button from dynamic list in memory
  const listInstances: CMSList[] = (await awaitAttributeLoaded('cmsload')) || [];

  for (const { items } of listInstances) {
    for (const { element } of items) {
      createSocialShareInstances(element);
    }
  }

  return {
    result: stores,
    destroy() {
      removeClickListener();
    },
  };
};
