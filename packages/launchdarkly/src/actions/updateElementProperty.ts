import type { LaunchDarklyFlags, LaunchDarklyFlagValueType } from '$packages/launchdarkly/src/utils/types';

import { ATTRIBUTES, SRC_PROPERTY, SUPPORTED_PROPERTIES, TEXT_PROPERTY } from '../utils/constants';

const attributeAction: Record<string, (element: HTMLElement, value: LaunchDarklyFlagValueType) => void> = {
  [TEXT_PROPERTY]: (element: HTMLElement, value: LaunchDarklyFlagValueType) => {
    element.textContent = String(value);
  },
  [SRC_PROPERTY]: (element: HTMLElement, value: LaunchDarklyFlagValueType) => {
    const image = element as HTMLImageElement;
    image.src = String(value);
  },
};
export const updateElementProperty = (flags: LaunchDarklyFlags): void => {
  const elements: NodeListOf<HTMLElement> = document.querySelectorAll<HTMLElement>(`[${ATTRIBUTES.setProperty.key}]`);

  elements.forEach((element) => {
    // get the value of the attribute fs-launchdarkly-property
    const flagName = element.getAttribute(ATTRIBUTES.flag.key) || '';
    const property = element.getAttribute(ATTRIBUTES.setProperty.key) || '';

    if (flags[flagName] && SUPPORTED_PROPERTIES.includes(property)) {
      attributeAction[property](element, flags[flagName]);
    }
  });
};
