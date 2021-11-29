import { generateSelectors } from '$utils/attributes';

export const ATTRIBUTES_PREFIX = 'fs-docs';

export const ATTRIBUTES = {
  /**
   * Defines the key elements for copying examples and scripts.
   */
  element: {
    key: `${ATTRIBUTES_PREFIX}-element`,
    values: {
      code: 'code',
      copyButton: 'copy-button',
      copyButtonText: 'copy-button-text',
      exampleDisplay: 'example-display',
      copyScript: 'copy-script',
      title: 'title',
      titleTarget: 'title-target',
      attributeTitle: 'attribute-title',
      attributeKey: 'attribute-key',
      attributeVersion: 'attribute-version',
      attributeDate: 'attribute-date',
      attributeChangeset: 'attribute-changeset',
      attributeSelect: 'attribute-select',
      loader: 'loader',
    },
  },

  /**
   * Defines an example to copy.
   */
  example: { key: `${ATTRIBUTES_PREFIX}-example` },

  /**
   * Defines the current attribute.
   * Set to the document body.
   */
  attribute: { key: `${ATTRIBUTES_PREFIX}-attribute` },
} as const;

export const getSelector = generateSelectors(ATTRIBUTES);
