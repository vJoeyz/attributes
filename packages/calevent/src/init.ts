import { type FsAttributeInit, waitWebflowReady } from '@finsweet/attributes-utils';

import { listenTriggerClicks } from './actions/trigger';
import { initCalEventInstance } from './factory';
import { queryAllElements } from './utils';
import { stores } from './utils/stores';

/**
 * Inits the attribute.
 */
export const init: FsAttributeInit = async () => {
  await waitWebflowReady();

  // Query all event elements
  const eventElements = queryAllElements('event');

  // Init all click listeners
  const eventCleanups = listenTriggerClicks();

  eventElements.map(initCalEventInstance);

  return {
    result: stores,
    destroy() {
      eventCleanups();
    },
  };
};
