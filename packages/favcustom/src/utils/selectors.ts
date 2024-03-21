import { FAV_CUSTOM_ATTRIBUTE, generateSelectors } from '@finsweet/attributes-utils';

import { ELEMENTS, SETTINGS } from './constants';

export const { queryElement } = generateSelectors(FAV_CUSTOM_ATTRIBUTE, ELEMENTS, SETTINGS);
