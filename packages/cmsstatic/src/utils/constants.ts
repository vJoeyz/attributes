import { type AttributeElements, type AttributeSettings } from '@finsweet/attributes-utils';

export const ELEMENTS = [
  /**
   * Defines a list to have a static element
   */
  'list',

  /**
   * Defines the static element
   */
  'static-item',
] as const satisfies AttributeElements;

export const SETTINGS = {
  /**
   * Defines the order of the static element in list.
   */
  order: {
    key: 'order',
  },

  /**
   * Defines if the element will be strict static or will interact with load, filters, order.
   */
  interactive: {
    key: 'interactive',
    values: { true: 'true' },
  },

  /**
   * Defines if the element will be repeated in the list.
   */
  repeat: {
    key: 'repeat',
  },
} as const satisfies AttributeSettings;
