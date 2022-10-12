import { extractCommaSeparatedValues } from '@finsweet/ts-utils';
import type { LDFlagSet } from 'launchdarkly-js-client-sdk';
import { is } from 'superstruct';

import { updateElementProperty } from './actions/properties';
import { showOrHideElement } from './actions/show';
import { ATTRIBUTES, LOADER_PROPERTY } from './utils/constants';
import { jsonFlagValueSchema } from './utils/json';
import type { JSONFlagValue } from './utils/types';

/**
 * Inits a flag element.
 * @param element
 * @param flags
 */
export const initFlagElement = (element: HTMLElement, flags: LDFlagSet) => {
  const flagName = element.getAttribute(ATTRIBUTES.flag.key);
  if (!flagName) return;

  const rawFlagValue = flags[flagName];

  const rawShowIf = element.getAttribute(ATTRIBUTES.showIf.key);
  const rawSetProperties = element.getAttribute(ATTRIBUTES.setProperties.key);

  // JSON value handling
  if (is(rawFlagValue, jsonFlagValueSchema)) {
    initJSON(element, rawFlagValue);
    return;
  }

  // Other values handling
  const flagValue =
    typeof rawFlagValue === 'string' || typeof rawFlagValue === 'number' || typeof rawFlagValue === 'boolean'
      ? String(rawFlagValue)
      : undefined;

  // showif is explicitly defined
  if (rawShowIf) {
    initShowIf(element, rawShowIf, flagValue);
  }

  // setproperties is explicitly defined
  if (rawSetProperties && flagValue) {
    initSetProperties(element, rawSetProperties, flagValue);
  }
};

/**
 * Inits an element with an explicit `showif` Attribute.
 * @param element
 * @param rawShowIf
 * @param flagValue
 */
const initShowIf = (element: HTMLElement, rawShowIf: string, flagValue?: string) => {
  const showConditions = extractCommaSeparatedValues(rawShowIf);
  const show = !!flagValue && showConditions.includes(flagValue);

  showOrHideElement(element, show);
};

/**
 * Inits an element with an explicit `setproperties` Attribute.
 * @param element
 * @param rawSetProperties
 * @param flagValue
 */
const initSetProperties = (element: HTMLElement, rawSetProperties: string, flagValue: string) => {
  const properties = extractCommaSeparatedValues(rawSetProperties);
  updateElementProperty(element, properties, flagValue);
};

/**
 * Inits an element with a JSON flag value.
 * @param element
 * @param jsonValue
 */
const initJSON = (element: HTMLElement, { show, properties }: JSONFlagValue) => {
  if (typeof show === 'boolean') {
    showOrHideElement(element, show);
  }

  if (properties) {
    for (const key in properties) {
      updateElementProperty(element, key, properties[key]);
    }
  }
};

/**
 * Hides loader element
 * @param element
 */
export const hideLoader = (element: HTMLElement) => {
  const rawElementValue = element.getAttribute(ATTRIBUTES.element.key);
  if (rawElementValue !== LOADER_PROPERTY) return;

  element.remove();
};
