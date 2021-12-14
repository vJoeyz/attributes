import { generateSelectors } from 'global/attributes';

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
   * Defines a Collection List that will be nested inside the target list element.
   */
  collection: { key: `${ATTRIBUTES_PREFIX}-collection` },

  /**
   * Defines an `Empty State` element.
   */
  empty: { key: `${ATTRIBUTES_PREFIX}-empty` },
} as const;

export const [getSelector, queryElement] = generateSelectors(ATTRIBUTES);
