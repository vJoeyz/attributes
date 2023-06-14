import { type AttributeElements, type AttributeSettings } from '@finsweet/attributes-utils';

export const ELEMENTS = [
  /**
   * Defines a list to be combined into the target.
   */
  'list',

  /**
   * Defines the `Previous` placeholder target.
   */
  'previous',

  /**
   * Defines the `Previous` Empty State.
   */
  'previous-empty',

  /**
   * Defines the `Next` placeholder target.
   */
  'next',

  /**
   * Defines the `Next` Empty State.
   */
  'next-empty',
] as const satisfies AttributeElements;

export const SETTINGS = {} as const satisfies AttributeSettings;
