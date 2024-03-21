import { generateSelectors, RICH_TEXT_ATTRIBUTE } from '@finsweet/attributes-utils';

import { ELEMENTS, SETTINGS } from './constants';

export const { getSettingSelector, hasAttributeValue, getElementSelector } = generateSelectors(
  RICH_TEXT_ATTRIBUTE,
  ELEMENTS,
  SETTINGS
);
