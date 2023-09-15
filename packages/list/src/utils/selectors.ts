import { generateSelectors, LIST_ATTRIBUTE } from '@finsweet/attributes-utils';

import { ELEMENTS, SETTINGS } from './constants';

export const {
  getElementSelector,
  queryAllElements,
  getSettingSelector,
  getAttribute,
  hasAttributeValue,
  getInstanceIndex,
} = generateSelectors(LIST_ATTRIBUTE, ELEMENTS, SETTINGS);
