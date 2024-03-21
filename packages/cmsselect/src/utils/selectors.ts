import { CMS_SELECT_ATTRIBUTE, generateSelectors } from '@finsweet/attributes-utils';

import { ELEMENTS, SETTINGS } from './constants';

export const { queryAllElements, getInstanceIndex } = generateSelectors(CMS_SELECT_ATTRIBUTE, ELEMENTS, SETTINGS);
