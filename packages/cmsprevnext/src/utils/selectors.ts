import { CMS_PREV_NEXT_ATTRIBUTE, generateSelectors } from '@finsweet/attributes-utils';

import { ELEMENTS, SETTINGS } from './constants';

export const { getElementSelector, queryElement } = generateSelectors(CMS_PREV_NEXT_ATTRIBUTE, ELEMENTS, SETTINGS);
