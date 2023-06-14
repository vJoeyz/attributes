import { generateSelectors, STAR_RATING_ATTRIBUTE } from '@finsweet/attributes-utils';

import { ELEMENTS, SETTINGS } from './constants';

export const { getAttribute, queryElement, getElementSelector, queryAllElements } = generateSelectors(
  STAR_RATING_ATTRIBUTE,
  ELEMENTS,
  SETTINGS
);
