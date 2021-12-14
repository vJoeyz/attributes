import { generateSelectors } from '$global/factory/selectors';

const ATTRIBUTES_PREFIX = 'fs-autovideo';

export const ATTRIBUTES = {
  element: {
    key: `${ATTRIBUTES_PREFIX}-element`,
    values: {},
  },
} as const;

export const [getSelector, queryElement] = generateSelectors(ATTRIBUTES);
