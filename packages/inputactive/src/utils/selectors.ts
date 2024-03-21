import { generateSelectors, INPUT_ACTIVE_ATTRIBUTE } from '@finsweet/attributes-utils';

import { ELEMENTS, SETTINGS } from './constants';

export const { getSettingSelector, getAttribute } = generateSelectors(INPUT_ACTIVE_ATTRIBUTE, ELEMENTS, SETTINGS);
