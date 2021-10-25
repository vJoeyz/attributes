import { generateDynamicAttibuteValue, generateSelectors } from '$utils/attributes';

const ATTRIBUTES_PREFIX = 'fs-populate';

export const ATTRIBUTES = {
  element: {
    key: `${ATTRIBUTES_PREFIX}-element`,
    values: {
      /**
       * Defines the elements as the source to populate the target.
       */
      source: generateDynamicAttibuteValue('source'),

      /**
       * Defines the element as the target to be populated.
       */
      target: 'target',
    },
  },
} as const;

export const getSelector = generateSelectors(ATTRIBUTES);
