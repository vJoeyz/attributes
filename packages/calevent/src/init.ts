import type { CMSList } from '@finsweet/attributes-cmscore';
import { type FsAttributeInit, waitAttributeLoaded, waitWebflowReady } from '@finsweet/attributes-utils';

import { listenTriggerClicks } from './actions/trigger';
import { createCalendarEventInstances } from './factory';

/**
 * Inits the attribute.
 */
export const init: FsAttributeInit = async () => {
  await waitWebflowReady();

  listenTriggerClicks();

  // create button for static items
  createCalendarEventInstances();

  return {};
  // create button from dynamic list in memory
  const listInstances: CMSList[] = (await waitAttributeLoaded('cmsload')) || [];

  for (const { items } of listInstances) {
    for (const { element } of items) {
      createCalendarEventInstances(element);
    }
  }
};
