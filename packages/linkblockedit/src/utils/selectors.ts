import { generateSelectors, LINK_BLOCK_EDIT_ATTRIBUTE } from '@finsweet/attributes-utils';

import { ELEMENTS, SETTINGS } from './constants';

export const { queryAllElements, getElementSelector } = generateSelectors(
  LINK_BLOCK_EDIT_ATTRIBUTE,
  ELEMENTS,
  SETTINGS
);
