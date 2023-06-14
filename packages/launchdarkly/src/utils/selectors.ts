import { generateSelectors, LAUNCHDARKLY_ATTRIBUTE } from '@finsweet/attributes-utils';

import { ELEMENTS, SETTINGS } from './constants';

export const { queryAllElements, getSettingSelector, getAttribute } = generateSelectors(
  LAUNCHDARKLY_ATTRIBUTE,
  ELEMENTS,
  SETTINGS
);
