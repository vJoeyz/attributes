import { COPY_CLIP_ATTRIBUTE, generateSelectors } from '@finsweet/attributes-utils';

import { ELEMENTS, SETTINGS } from './constants';

export const { queryElement, queryAllElements, getAttribute, getInstanceIndex } = generateSelectors(
  COPY_CLIP_ATTRIBUTE,
  ELEMENTS,
  SETTINGS
);
