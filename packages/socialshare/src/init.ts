import type { List } from '@finsweet/attributes-list';
import { type FinsweetAttributeInit, waitAttributeLoaded, waitWebflowReady } from '@finsweet/attributes-utils';

import { listenTriggerClicks } from './actions/trigger';
import { createSocialShareInstances } from './factory';
import { stores } from './utils/stores';

/**
 * Inits the attribute.
 */
export const init: FinsweetAttributeInit = async () => {
  await waitWebflowReady();

  // Init global click listener
  const removeClickListener = listenTriggerClicks();

  // create button for static items
  createSocialShareInstances();

  // create button from dynamic list in memory
  const listInstances: List[] = (await waitAttributeLoaded('list')) || [];

  for (const { items } of listInstances) {
    for (const { element } of items.value) {
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
