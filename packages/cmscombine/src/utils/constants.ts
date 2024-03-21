import { type AttributeElements, type AttributeSettings } from '@finsweet/attributes-utils';

export const ELEMENTS = [
  /**
   * Defines a list to be combined into the target.
   */
  'list',

  /**
   * Defines an element where to display the total items of the list.
   */
  'items-count',
] as const satisfies AttributeElements;

export const SETTINGS = {} as const satisfies AttributeSettings;
