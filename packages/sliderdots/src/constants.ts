const ATTRIBUTES_PREFIX = 'fs-sliderdots';

export const ATTRIBUTES = {
  element: {
    key: `${ATTRIBUTES_PREFIX}-element`,
    values: {
      /**
       * Defines the content to be added to the slider dot.
       */
      content: 'content',
    },
  },

  /**
   * Defines if the content should be removed or just duplicated.
   */
  remove: {
    key: `${ATTRIBUTES_PREFIX}-remove`,
    values: { true: 'true' },
  },
} as const;
