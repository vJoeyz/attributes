const ATTRIBUTES_PREFIX = 'fs-favcustom';

export const ATTRIBUTES = {
  element: {
    key: `${ATTRIBUTES_PREFIX}-element`,
    values: {
      /**
       * Defines an `<img>` element which `src` will be set as the favicon.
       */
      src: 'src',
    },
  },

  /**
   * Defines the URL source of the image to be set as the favicon.
   */
  src: { key: `${ATTRIBUTES_PREFIX}-src`, values: {} },
} as const;
