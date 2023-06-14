import { CMS_TABS_ATTRIBUTE, generateSelectors } from '@finsweet/attributes-utils';

import { ELEMENTS, SETTINGS } from './constants';

export const { getInstanceIndex, getElementSelector, hasAttributeValue, queryElement } = generateSelectors(
  CMS_TABS_ATTRIBUTE,
  ELEMENTS,
  SETTINGS
);
