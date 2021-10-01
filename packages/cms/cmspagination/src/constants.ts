import { generateSelectors } from '$utils/attributes';

const ATTRIBUTES_PREFIX = 'fs-cmspagination';

export const ATTRIBUTES = {
  element: {
    key: `${ATTRIBUTES_PREFIX}-element`,
    values: {
      /**
       * Defines a pagination button template to be instantiated.
       */
      button: 'button',
    },
  },

  /**
   * Defines the maximum number of buttons to display.
   */
  limit: { key: `${ATTRIBUTES_PREFIX}-limit` },

  /**
   * Defines a global selector to query pagination buttons to instantiate.
   */
  buttons: { key: `${ATTRIBUTES_PREFIX}-buttons` },
} as const;

export const getSelector = generateSelectors(ATTRIBUTES);
