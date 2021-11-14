import { generateDynamicAttibuteValue, generateSelectors } from '$utils/attributes';

const ATTRIBUTES_PREFIX = 'fs-cmscss';

export const ATTRIBUTES = {
  element: {
    key: `${ATTRIBUTES_PREFIX}-element`,
    values: {
      /**
       * Defines a list to be combined into the target.
       */
      list: generateDynamicAttibuteValue('list'),
    },
  },

  pseudo: { key: `${ATTRIBUTES_PREFIX}-pseudo` },

  class: { key: `${ATTRIBUTES_PREFIX}-class` },
} as const;

export const getSelector = generateSelectors(ATTRIBUTES);
