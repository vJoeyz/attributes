import { CMS_NEST_ATTRIBUTE, generateSelectors } from '@finsweet/attributes-utils';

import { ELEMENTS, SETTINGS } from './constants';

export const { getElementSelector, getSettingSelector, queryElement, getAttribute, hasAttributeValue } =
  generateSelectors(CMS_NEST_ATTRIBUTE, ELEMENTS, SETTINGS);
