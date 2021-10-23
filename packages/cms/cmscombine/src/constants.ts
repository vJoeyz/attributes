import { generateDynamicAttibuteValue, generateSelectors } from '$utils/attributes';

const ATTRIBUTES_PREFIX = 'fs-cmscombine';

export const ATTRIBUTES = {
  element: {
    key: `${ATTRIBUTES_PREFIX}-element`,
    values: {
      /**
       * Defines a list to be combined into the target.
       */
      list: generateDynamicAttibuteValue('list'),

      /**
       * Defines the target list where all lists will be combined into.
       * If not defined, the first queried list will act as the target.
       */
      target: generateDynamicAttibuteValue('target'),
    },
  },
} as const;

export const getSelector = generateSelectors(ATTRIBUTES);
