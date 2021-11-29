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
   * Defines if the HTML should be sanitized before rendering it.
   */
  sanitize: { key: `${ATTRIBUTES_PREFIX}-sanitize`, values: { true: 'true' } },

  /**
   * Defines if Webflow should be restarted after loading new items.
   */
  resetIx: { key: `${ATTRIBUTES_PREFIX}-resetix`, values: { true: 'true' } },

  /**
   * Defines a global selector for RTB elements.
   */
  globalSelector: { key: `${ATTRIBUTES_PREFIX}-selector` },
} as const;

export const [getSelector, queryElement] = generateSelectors(ATTRIBUTES);

export const IGNORE_LINE_PREFIX = '&lt;!-- fs-richtext-ignore --&gt;';
