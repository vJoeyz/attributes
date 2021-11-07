import { generateSelectors } from '$utils/attributes';

const ATTRIBUTES_PREFIX = 'fs-autovideo';

export const ATTRIBUTES = {
  element: {
    key: `${ATTRIBUTES_PREFIX}-element`,
    values: {},
  },
} as const;

export const getSelector = generateSelectors(ATTRIBUTES);
