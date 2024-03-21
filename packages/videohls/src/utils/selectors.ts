import { generateSelectors, VIDEO_HLS_ATTRIBUTE } from '@finsweet/attributes-utils';

import { ELEMENTS, SETTINGS } from './constants';

export const { getAttribute } = generateSelectors(VIDEO_HLS_ATTRIBUTE, ELEMENTS, SETTINGS);
