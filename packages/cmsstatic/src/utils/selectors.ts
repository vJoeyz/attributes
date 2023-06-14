import { CMS_STATIC_ATTRIBUTE, generateSelectors } from '@finsweet/attributes-utils';

import { ELEMENTS, SETTINGS } from './constants';

export const { getElementSelector, getInstanceIndex, queryAllElements, getAttribute, hasAttributeValue } =
  generateSelectors(CMS_STATIC_ATTRIBUTE, ELEMENTS, SETTINGS);
