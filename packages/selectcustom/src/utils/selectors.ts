import { generateSelectors, SELECT_CUSTOM_ATTRIBUTE } from '@finsweet/attributes-utils';

import { ELEMENTS, SETTINGS } from './constants';

export const { queryElement, getElementSelector, hasAttributeValue, queryAllElements } = generateSelectors(
  SELECT_CUSTOM_ATTRIBUTE,
  ELEMENTS,
  SETTINGS
);
