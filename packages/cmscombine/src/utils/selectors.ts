import { CMS_COMBINE_ATTRIBUTE, generateSelectors } from '@finsweet/attributes-utils';

import { ELEMENTS, SETTINGS } from './constants';

export const { getInstanceIndex, getElementSelector, queryElement } = generateSelectors(
  CMS_COMBINE_ATTRIBUTE,
  ELEMENTS,
  SETTINGS
);
