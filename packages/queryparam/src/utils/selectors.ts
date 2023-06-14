import { generateSelectors, QUERY_PARAM_ATTRIBUTE } from '@finsweet/attributes-utils';

import { ELEMENTS, SETTINGS } from './constants';

export const { getSettingSelector } = generateSelectors(QUERY_PARAM_ATTRIBUTE, ELEMENTS, SETTINGS);
