import { generateSelectors } from '$global/factory/selectors';

const ATTRIBUTES_PREFIX = 'fs-linkblockedit';

export const ATTRIBUTES = {
  element: {
    key: `${ATTRIBUTES_PREFIX}-element`,
    values: {
      /**
       * Defines the parent element that will act as the `Link Block`.
       */
      parent: 'parent',
    },
  },

  /**
   * Defines a global selector to query multiple `parent` elements.
   */
  selector: { key: `${ATTRIBUTES_PREFIX}-selector` },
} as const;

export const [getSelector, queryElement] = generateSelectors(ATTRIBUTES);
