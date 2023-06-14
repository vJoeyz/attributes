import { type AttributeElements, type AttributeSettings } from '@finsweet/attributes-utils';

export const ELEMENTS = [
  /**
   * Defines the CMS list or list-wrapper.
   */
  'list',

  /**
   * Defines the element that will display the amount of CMS items.
   */
  'value',
] as const satisfies AttributeElements;

export const SETTINGS = {} as const satisfies AttributeSettings;
