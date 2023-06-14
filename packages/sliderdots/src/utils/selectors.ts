import { generateSelectors, SLIDER_DOTS_ATTRIBUTE } from '@finsweet/attributes-utils';

import { ELEMENTS, SETTINGS } from './constants';

export const { getInstanceIndex, queryElement, getAttribute, hasAttributeValue, getElementSelector } =
  generateSelectors(SLIDER_DOTS_ATTRIBUTE, ELEMENTS, SETTINGS);
