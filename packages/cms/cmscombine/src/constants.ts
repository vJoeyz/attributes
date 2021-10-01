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

  /**
   * Defines a global selector to query lists to combine.
   */
  lists: { key: `${ATTRIBUTES_PREFIX}-lists` },

  /**
   * Defines a global target to query the target list where to combine.
   */
  target: { key: `${ATTRIBUTES_PREFIX}-target` },
} as const;

export const getSelector = generateSelectors(ATTRIBUTES);
