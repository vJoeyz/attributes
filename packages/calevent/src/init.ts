import { type FsAttributeInit, waitWebflowReady } from '@finsweet/attributes-utils';

import { listenTriggerClicks } from './actions/trigger';
import { generateICalendarEvent } from './calendar';
import { createCalendarEventInstances } from './factory';
import { getInstanceIndex, queryAllElements, queryElement } from './utils';

/**
 * Inits the attribute.
 */
export const init: FsAttributeInit = async () => {
  await waitWebflowReady();

  // Call the function to generate the ICS file
  // generateICalendarEvent(eventData, 'example-event.ics');

  listenTriggerClicks();

  createCalendarEventInstances();

  return {};
};
