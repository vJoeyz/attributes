import { COMPONENT_ATTRIBUTE, generateSelectors } from '@finsweet/attributes-utils';

import { ELEMENTS, SETTINGS } from './constants';

export const { getSettingSelector, getAttribute } = generateSelectors(COMPONENT_ATTRIBUTE, ELEMENTS, SETTINGS);
