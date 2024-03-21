import { COMBO_BOX_ATTRIBUTE, generateSelectors } from '@finsweet/attributes-utils';

import { ELEMENTS, SETTINGS } from './constants';

export const { queryElement, queryAllElements, getElementSelector, hasAttributeValue } = generateSelectors(
  COMBO_BOX_ATTRIBUTE,
  ELEMENTS,
  SETTINGS
);
