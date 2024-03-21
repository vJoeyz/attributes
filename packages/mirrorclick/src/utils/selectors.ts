import { generateSelectors, MIRROR_CLICK_ATTRIBUTE } from '@finsweet/attributes-utils';

import { ELEMENTS, SETTINGS } from './constants';

export const { getElementSelector, getInstanceIndex, queryAllElements, getAttribute } = generateSelectors(
  MIRROR_CLICK_ATTRIBUTE,
  ELEMENTS,
  SETTINGS
);
