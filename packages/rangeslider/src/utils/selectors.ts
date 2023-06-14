import { generateSelectors, RANGE_SLIDER_ATTRIBUTE } from '@finsweet/attributes-utils';

import { ELEMENTS, SETTINGS } from './constants';

export const { queryElement, queryAllElements, hasAttributeValue, getAttribute } = generateSelectors(
  RANGE_SLIDER_ATTRIBUTE,
  ELEMENTS,
  SETTINGS
);
