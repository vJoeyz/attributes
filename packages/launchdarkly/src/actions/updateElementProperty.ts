import type { LDFlagSet, LDFlagValue } from 'launchdarkly-js-client-sdk';

import { ATTRIBUTES, getSelector, SRC_PROPERTY, TEXT_PROPERTY } from '../utils/constants';

const attributeAction: Record<string, (element: HTMLElement, value: LDFlagValue) => void> = {
  [TEXT_PROPERTY]: (element: HTMLElement, value: LDFlagSet) => {
    element.textContent = String(value);
  },
  [SRC_PROPERTY]: (element: HTMLElement, value: LDFlagSet) => {
    const image = element as HTMLImageElement;
    image.src = String(value);
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

    const flag = flags[flagName];

    if (flag && property in attributeAction) {
      attributeAction[property](element, flag);
    }
  });
};
