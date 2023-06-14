import { type AttributeElements, type AttributeSettings } from '@finsweet/attributes-utils';

export const ELEMENTS = [
  /**
   * Defines an `<img>` element which `src` will be set as the favicon.
   */
  'src',
] as const satisfies AttributeElements;

export const SETTINGS = {} as const satisfies AttributeSettings;
