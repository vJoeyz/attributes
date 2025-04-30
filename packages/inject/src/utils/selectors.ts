import { generateSelectors, INJECT_ATTRIBUTE } from '@finsweet/attributes-utils';

import { ELEMENTS, SETTINGS } from './constants';

export const { getAttribute, getInstance, queryAllElements, queryElement } = generateSelectors(
  INJECT_ATTRIBUTE,
  ELEMENTS,
  SETTINGS
);
