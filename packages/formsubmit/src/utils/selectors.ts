import { FORM_SUBMIT_ATTRIBUTE, generateSelectors } from '@finsweet/attributes-utils';

import { ELEMENTS, SETTINGS } from './constants';

export const { getSettingSelector, getInstanceIndex, queryAllElements, getAttribute, hasAttributeValue } =
  generateSelectors(FORM_SUBMIT_ATTRIBUTE, ELEMENTS, SETTINGS);
