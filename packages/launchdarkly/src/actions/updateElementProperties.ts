import type { LDFlagValue } from 'launchdarkly-js-client-sdk';

import { ATTRIBUTES } from '../utils/constants';
import { attributeAction } from './updateElementProperty';

export const updateElementProperties = (elements: HTMLElement[], flags: LDFlagValue) => {
  elements.forEach((element) => {
    const flagName = element.getAttribute(ATTRIBUTES.flag.key);
    if (!flagName) {
      return;
    }

    const flagJSONValue = flags[flagName];
    if (!flagJSONValue || !flagJSONValue.show || !flagJSONValue.properties) return;

    const { properties } = flagJSONValue;

    Object.keys(properties).forEach((property) => {
      const value = properties[property];
      if (property in attributeAction) {
        attributeAction[property](element, value);
      }
    });
  });
};
