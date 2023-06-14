import { type AttributeElements, type AttributeSettings } from '@finsweet/attributes-utils';

export const ELEMENTS = [] as const satisfies AttributeElements;

export const SETTINGS = {
  /**
   * Defines the query param keys
   */
  name: { key: 'name' },

  /**
   * Defines if query param should be removed after loading the page.
   */
  removequery: {
    key: 'removequery',
    values: { true: 'true' },
  },
} as const satisfies AttributeSettings;
