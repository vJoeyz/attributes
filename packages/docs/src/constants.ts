export const ATTRIBUTES_PREFIX = 'fs-docs';

export const ATTRIBUTES = {
  /**
   * Defines the key elements for copying examples and scripts.
   */
  element: {
    key: `${ATTRIBUTES_PREFIX}-element`,
    values: {
      copyButton: 'copy-button',
      copyButtonText: 'copy-button-text',
      exampleDisplay: 'example-display',
      copyScript: 'copy-script',
    },
  },

  /**
   * Defines the current attribute.
   */
  attribute: {
    key: `${ATTRIBUTES_PREFIX}-attribute`,
    values: {},
  },
} as const;
