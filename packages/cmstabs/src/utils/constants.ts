import { type AttributeElements, type AttributeSettings } from '@finsweet/attributes-utils';

export const ELEMENTS = [
  /**
   * Defines a list to be included into the target tabs.
   */
  'list',

  /**
   * Defines the target tabs where all lists will be included into.
   */
  'tabs',

  /**
   * Defines the content that will be placed inside the generated `Tab Link` in the `Tabs Menu`.
   */
  'tab-link',
] as const satisfies AttributeElements;

export const SETTINGS = {
  /**
   * Defines if Webflow should be restarted after populating the tabs.
   */
  resetix: { key: 'resetix', values: { true: 'true' } },
} as const satisfies AttributeSettings;
