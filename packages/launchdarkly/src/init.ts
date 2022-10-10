import { extractCommaSeparatedValues } from '@finsweet/ts-utils';
import { LAUNCHDARKLY_ATTRIBUTE } from 'global/constants/attributes';
import type { LDClient } from 'launchdarkly-js-client-sdk';

import { showOrHideElement, initializeUser, updateElementProperties, updateElementProperty } from '../src/actions';
import type { LaunchDarklyAttributes } from '../src/utils/types';

/**
 * Inits the attribute.
 */
export const init = async ({ devClientId, prodClientId, eventsToTrack }: LaunchDarklyAttributes): Promise<LDClient> => {
  const devEnvironment = window.location.origin.includes('webflow.io');

  const clientId = devEnvironment ? devClientId || prodClientId : prodClientId || devClientId;
  if (!clientId) {
    throw new Error('Client ID is required');
  }

  const client = await initializeUser(clientId);
  if (eventsToTrack) {
    const events = Array.isArray(eventsToTrack) ? eventsToTrack : extractCommaSeparatedValues(eventsToTrack);
    events.forEach((event) => {
      client.track(event);
    });
  }
  const flags = client.allFlags();
  showOrHideElement(flags);
  updateElementProperty(flags);
  updateElementProperties(flags);
  window.fsAttributes[LAUNCHDARKLY_ATTRIBUTE].resolve?.(client);
  return client;
};
