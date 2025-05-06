import { generateSelectors, LIST_ATTRIBUTE } from '@finsweet/attributes-utils';

import { ELEMENTS, SETTINGS } from './constants';

export const {
  getElementSelector,
  queryElement,
  queryAllElements,
  getSettingSelector,
  getSettingAttributeName,
  getClosestElement,
  getAttribute,
  hasAttributeValue,
  getInstance,
  getInstanceSelector,
} = generateSelectors(LIST_ATTRIBUTE, ELEMENTS, SETTINGS);

export const CUSTOM_VALUE_ATTRIBUTE = getSettingAttributeName('value');
