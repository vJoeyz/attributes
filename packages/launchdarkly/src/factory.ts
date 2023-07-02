import { extractCommaSeparatedValues, isBoolean, isNumber, isString } from '@finsweet/attributes-utils';
import type { LDFlagSet } from 'launchdarkly-js-client-sdk';
import { is } from 'superstruct';

import { updateElementProperty } from './actions/properties';
import { jsonFlagValueSchema, SETTINGS } from './utils/constants';
import { getAttribute, getSettingSelector } from './utils/selectors';
import type { JSONFlagValue } from './utils/types';

/**
 * Inits all flag elements.
 * Once finished, it removes the `fs-launchdarkly-cloak` of the elements.
 * @param flags
 */
export const initFlags = (flags: LDFlagSet) => {
  const allFlagElements = document.querySelectorAll<HTMLElement>(getSettingSelector('flag'));

  for (const element of allFlagElements) {
    initFlagElement(element, flags);

    element.removeAttribute(SETTINGS.cloak.key);
  }
};

/**
 * Inits a flag element.
 * @param element
 * @param flags
 */
const initFlagElement = (element: HTMLElement, flags: LDFlagSet) => {
  const flagName = getAttribute(element, 'flag');
  if (!flagName) return;

  const rawFlagValue = flags[flagName];

  const rawShowIf = getAttribute(element, 'showif');
  const rawSetProperties = getAttribute(element, 'setproperties');

  // JSON value handling
  if (is(rawFlagValue, jsonFlagValueSchema)) {
    initJSON(element, rawFlagValue);
    return;
  }

  // Other values handling
  const flagValue =
    isString(rawFlagValue) || isNumber(rawFlagValue) || isBoolean(rawFlagValue) ? String(rawFlagValue) : undefined;

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

  if (!show) {
    element.remove();
  }
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
  if (show === false) {
    element.remove();
  }

  if (properties) {
    for (const key in properties) {
      updateElementProperty(element, key, properties[key]);
    }
  }
};
