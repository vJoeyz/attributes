import { generateSelectors } from '$utils/attributes';

const ATTRIBUTES_PREFIX = 'fs-cmsnest';

export const ATTRIBUTES = {
  element: {
    key: `${ATTRIBUTES_PREFIX}-element`,
    values: {
      /**
       * Defines a list to be combined into the target.
       */
      list: 'list',
    },
  },

  /**
   * Defines a list that will be nested inside the target list element.
   */
  list: { key: `${ATTRIBUTES_PREFIX}-list` },

  /**
   * Defines a global selector to query lists to combine.
   */
  lists: { key: `${ATTRIBUTES_PREFIX}-lists` },
} as const;

export const getSelector = generateSelectors(ATTRIBUTES);
