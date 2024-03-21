import { type AttributeElements, type AttributeSettings } from '@finsweet/attributes-utils';

export const ELEMENTS = [
  /**
   * Defines a rich text block instance.
   */
  'rich-text',
] as const satisfies AttributeElements;

export const SETTINGS = {
  /**
   * Defines a custom component.
   */
  component: { key: 'component' },

  /**
   * Defines if the HTML should be sanitized before rendering it.
   */
  sanitize: { key: 'sanitize', values: { true: 'true' } },

  /**
   * Defines if Webflow should be restarted after loading new items.
   */
  resetix: { key: 'resetix', values: { true: 'true' } },
} as const satisfies AttributeSettings;

export const IGNORE_LINE_PREFIX = '&lt;!-- fs-richtext-ignore --&gt;';
