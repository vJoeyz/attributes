import { type AttributeElements, type AttributeSettings } from '@finsweet/attributes-utils';

export const ELEMENTS = [
  /**
   * Defines a list to be combined into the target.
   */
  'list',

  /**
   * Defines a target element where a list will be nested into.
   */
  'nest-target',

  /**
   * Defines an element that contains a comma-separated list of slugs.
   */
  'slugs',
] as const satisfies AttributeElements;

export const SETTINGS = {
  /**
   * Defines a Collection List that will be nested inside the target list element.
   */
  collection: { key: 'collection' },

  /**
   * Defines an `Empty State` element.
   */
  empty: { key: 'empty' },

  /**
   * Defines if the documents should be cached after fetching them.
   * Defaults to `true`.
   */
  cache: { key: 'cache', values: { false: 'false' } },
} as const satisfies AttributeSettings;
