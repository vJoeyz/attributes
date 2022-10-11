import { extractCommaSeparatedValues } from '@finsweet/ts-utils';
import { LAUNCHDARKLY_ATTRIBUTE } from 'global/constants/attributes';
import type { LDClient, LDFlagSet } from 'launchdarkly-js-client-sdk';

import type { LaunchDarklyAttributes } from '../src/utils/types';
import { initializeClient } from './actions/client';
import { updateElementProperty } from './actions/properties';
import { showOrHideElement } from './actions/show';
import { ATTRIBUTES, getSelector } from './utils/constants';
import { parseJSONFlagValue } from './utils/json';

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

  window.fsAttributes[LAUNCHDARKLY_ATTRIBUTE].resolve?.(client);
  return client;
};

/**
 * Inits a flag element.
 * @param element
 * @param flags
 */
const initFlagElement = (element: HTMLElement, flags: LDFlagSet) => {
  const flagName = element.getAttribute(ATTRIBUTES.flag.key);
  if (!flagName) return;

  const flagValue = flags[flagName] ? String(flags[flagName]) : undefined;

  // showif is explicitly defined
  const rawShowIf = element.getAttribute(ATTRIBUTES.showIf.key);
  if (rawShowIf) {
    const showConditions = extractCommaSeparatedValues(rawShowIf);
    const show = !!flagValue && showConditions.includes(flagValue);

    showOrHideElement(element, show);
    return;
  }

  if (!flagValue) return;

  // setproperties is explicitly defined
  const rawSetProperties = element.getAttribute(ATTRIBUTES.setProperties.key);
  if (rawSetProperties) {
    const properties = extractCommaSeparatedValues(rawSetProperties);
    updateElementProperty(element, properties, flagValue);
    return;
  }

  // No actions are explicitly defined, thus we fall back to JSON handling
  const jsonValue = parseJSONFlagValue(flagValue);
  if (jsonValue) {
    const { show, properties } = jsonValue;

    if (typeof show === 'boolean') {
      showOrHideElement(element, show);
    }

    if (properties) {
      for (const key in properties) {
        updateElementProperty(element, key, properties[key]);
      }
    }
  }
};
