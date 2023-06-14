import { generateSelectors, NUMBER_COUNT_ATTRIBUTE } from '@finsweet/attributes-utils';

import { ELEMENTS, SETTINGS } from './constants';

export const { getAttribute, hasAttributeValue, queryAllElements } = generateSelectors(
  NUMBER_COUNT_ATTRIBUTE,
  ELEMENTS,
  SETTINGS
);
