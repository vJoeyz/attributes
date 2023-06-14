import { CMS_SLIDER_ATTRIBUTE, generateSelectors } from '@finsweet/attributes-utils';

import { ELEMENTS, SETTINGS } from './constants';

export const { getElementSelector, queryElement, getInstanceIndex, hasAttributeValue } = generateSelectors(
  CMS_SLIDER_ATTRIBUTE,
  ELEMENTS,
  SETTINGS
);
