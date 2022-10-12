import { extractCommaSeparatedValues } from '@finsweet/ts-utils';
import { LAUNCHDARKLY_ATTRIBUTE } from 'global/constants/attributes';
import type { LDClient } from 'launchdarkly-js-client-sdk';

import type { LaunchDarklyAttributes } from '../src/utils/types';
import { initializeClient } from './actions/client';
import { hideLoader, initFlagElement } from './factory';
import { getSelector } from './utils/constants';

/**
 * Inits the attribute.
 */
export const init = async ({ devClientId, prodClientId, eventsToTrack }: LaunchDarklyAttributes): Promise<LDClient> => {
  const devEnvironment = window.location.origin.includes('webflow.io');

  const clientId = devEnvironment ? devClientId || prodClientId : prodClientId || devClientId;
  if (!clientId) {
    throw new Error('Client ID is required');
  }

  const client = await initializeClient(clientId);

  if (eventsToTrack) {
    const events = Array.isArray(eventsToTrack) ? eventsToTrack : extractCommaSeparatedValues(eventsToTrack);
    events.forEach((event) => client.track(event));
  }

  const allFlagElements = document.querySelectorAll<HTMLElement>(getSelector('flag'));
  const flags = client.allFlags();

  for (const element of allFlagElements) {
    initFlagElement(element, flags);
  }

  const allElements = document.querySelectorAll<HTMLElement>(getSelector('element'));
  for (const element of allElements) {
    hideLoader(element);
  }

  window.fsAttributes[LAUNCHDARKLY_ATTRIBUTE].resolve?.(client);
  return client;
};
