import { generateSelectors } from '@global/factory/selectors';
import { AUTO_VIDEO_ATTRIBUTE } from 'global/constants/attributes';

const ATTRIBUTES_PREFIX = `fs-${AUTO_VIDEO_ATTRIBUTE}`;

export const ATTRIBUTES = {
  element: {
    key: `${ATTRIBUTES_PREFIX}-element`,
    values: {},
  },
} as const;

export const [getSelector, queryElement] = generateSelectors(ATTRIBUTES);
