import type { LDFlagValue } from 'launchdarkly-js-client-sdk';

import { ATTRIBUTES, getSelector, JSON_ATTRIBUTE } from '../utils/constants';
import { attributeAction } from './updateElementProperty';

export const updateElementProperties = (flags: LDFlagValue): void => {
  const elements = document.querySelectorAll<HTMLElement>(getSelector('setProperties'));

  elements.forEach((element) => {
    const flagName = element.getAttribute(ATTRIBUTES.flag.key);
    const property = element.getAttribute(ATTRIBUTES.setProperties.key);

    if (!flagName || property !== JSON_ATTRIBUTE) {
      return;
    }

    const flagJSONValue = flags[flagName];
    if (!flagJSONValue) return;

    Object.keys(flagJSONValue).forEach((property) => {
      const value = flagJSONValue[property];
      if (property in attributeAction) {
        attributeAction[property](element, value);
      }
    });
  });
};
