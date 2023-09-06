import { CAL_EVENT_ATTRIBUTE, generateSelectors } from '@finsweet/attributes-utils';

import { ELEMENTS, SETTINGS } from '.';

export const { queryElement, queryAllElements, getElementSelector } = generateSelectors(
  CAL_EVENT_ATTRIBUTE,
  ELEMENTS,
  SETTINGS
);
