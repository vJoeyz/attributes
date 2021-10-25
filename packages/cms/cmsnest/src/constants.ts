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
   * Defines an `Empty State` element.
   */
  empty: { key: `${ATTRIBUTES_PREFIX}-empty` },
} as const;

export const getSelector = generateSelectors(ATTRIBUTES);
