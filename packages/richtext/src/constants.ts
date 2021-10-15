import { generateSelectors } from '$utils/attributes';

const ATTRIBUTES_PREFIX = 'fs-richtext';

export const ATTRIBUTES = {
  element: {
    key: `${ATTRIBUTES_PREFIX}-element`,
    values: {
      /**
       * Defines a rich text block instance.
       */
      richText: 'rich-text',
    },
  },

  /**
   * Defines a custom component.
   */
  component: { key: `${ATTRIBUTES_PREFIX}-component` },

  /**
   * Defines a global selector for RTB elements.
   */
  globalSelector: { key: `${ATTRIBUTES_PREFIX}-selector` },

  /**
   * Defines if Webflow should be restarted after loading new items.
   */
  resetIx: { key: `${ATTRIBUTES_PREFIX}-resetix`, values: { true: 'true' } },
} as const;

export const getSelector = generateSelectors(ATTRIBUTES);

export const IGNORE_LINE_PREFIX = '&lt;!-- fs-richtext-ignore --&gt;';
