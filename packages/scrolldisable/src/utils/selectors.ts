import { generateSelectors, SCROLL_DISABLE_ATTRIBUTE } from '@finsweet/attributes-utils';

import { ELEMENTS, SETTINGS } from './constants';

export const { getElementSelector, getAttribute, queryAllElements, getSettingSelector, hasAttributeValue } =
  generateSelectors(SCROLL_DISABLE_ATTRIBUTE, ELEMENTS, SETTINGS);
