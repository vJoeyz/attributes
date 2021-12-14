import { generateSelectors } from 'global/attributes';

const ATTRIBUTES_PREFIX = 'fs-autovideo';

export const ATTRIBUTES = {
  element: {
    key: `${ATTRIBUTES_PREFIX}-element`,
    values: {},
  },
} as const;

export const [getSelector, queryElement] = generateSelectors(ATTRIBUTES);
