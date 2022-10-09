import { extractCommaSeparatedValues } from '@finsweet/ts-utils';
import type { LDFlagSet, LDFlagValue } from 'launchdarkly-js-client-sdk';

import {
  ATTRIBUTES,
  getSelector,
  SRC_ATTRIBUTE,
  SRCSET_ATTRIBUTE,
  SIZES_ATTRIBUTE,
  TEXT_ATTRIBUTE,
} from '../utils/constants';

export const attributeAction: Record<string, (element: HTMLElement, value: LDFlagValue) => void> = {
  [TEXT_ATTRIBUTE]: (element: HTMLElement, value: LDFlagSet) => {
    element.innerText = String(value);
  },
  [SRC_ATTRIBUTE]: (element: HTMLElement, value: LDFlagSet) => {
    element.setAttribute(SRC_ATTRIBUTE, String(value));
    element.removeAttribute(SRCSET_ATTRIBUTE);
  },
  [SRCSET_ATTRIBUTE]: (element: HTMLElement, value: LDFlagSet) => {
    element.setAttribute(SRCSET_ATTRIBUTE, String(value));
    element.removeAttribute(SRC_ATTRIBUTE);
  },
  [SIZES_ATTRIBUTE]: (element: HTMLElement, value: LDFlagSet) => {
    element.setAttribute(SIZES_ATTRIBUTE, String(value));
  },
};

export const updateElementProperty = (flags: LDFlagSet): void => {
  const elements = document.querySelectorAll<HTMLElement>(getSelector('setProperty'));

  elements.forEach((element) => {
    // get the value of the attribute fs-launchdarkly-property
    const flagName = element.getAttribute(ATTRIBUTES.flag.key);
    const property = element.getAttribute(ATTRIBUTES.setProperty.key);

    if (!flagName || !property) {
      return;
    }

    const allProperties = extractCommaSeparatedValues(property);
    const flag = flags[flagName];

    if (!flag) return;
    for (const property of allProperties) {
      if (property in attributeAction) attributeAction[property](element, flag);
    }
  });
};
