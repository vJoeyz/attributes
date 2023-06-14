import { CODE_HIGHLIGHT_ATTRIBUTE, generateSelectors } from '@finsweet/attributes-utils';

import { ELEMENTS, SETTINGS } from './constants';

export const { queryAllElements, getAttribute } = generateSelectors(CODE_HIGHLIGHT_ATTRIBUTE, ELEMENTS, SETTINGS);
