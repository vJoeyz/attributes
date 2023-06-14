import { generateSelectors, GREENHOUSE_ATTRIBUTE } from '@finsweet/attributes-utils';

import { ELEMENTS, SETTINGS } from './constants';

export const { getAttribute, getSettingSelector, queryElement, queryAllElements } = generateSelectors(
  GREENHOUSE_ATTRIBUTE,
  ELEMENTS,
  SETTINGS
);
