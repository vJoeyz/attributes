import { type AttributeElements, type AttributeSettings } from '@finsweet/attributes-utils';

export const TEXT_VALUE_ELEMENT_KEY = 'text-value';
export const SELECT_ELEMENT_KEY = 'select';

export const ELEMENTS = [
  /**
   * Defines the elements as the source to populate the target.
   */
  'text-value',

  /**
   * Defines the element as the target to be populated.
   */
  'select',
] as const satisfies AttributeElements;

export const SETTINGS = {} as const satisfies AttributeSettings;
