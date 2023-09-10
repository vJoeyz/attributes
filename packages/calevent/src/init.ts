import { type FsAttributeInit, waitWebflowReady } from '@finsweet/attributes-utils';

import { listenTriggerClicks } from './actions/trigger';
import { createCalendarEventInstances } from './factory';

/**
 * Inits the attribute.
 */
export const init: FsAttributeInit = async () => {
  await waitWebflowReady();

  listenTriggerClicks();

  createCalendarEventInstances();

  return {};
};
