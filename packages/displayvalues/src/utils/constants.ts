import { type AttributeElements, type AttributeSettings } from '@finsweet/attributes-utils';

export const ELEMENTS = [
  /**
   * Defines the element as the source of the event.
   */
  'source',

  /**
   * Defines the element as the target to display the source value.
   */
  'target',
] as const satisfies AttributeElements;

export const SETTINGS = {
  /**
   * Defines a placeholder text to display when no value exists.
   */
  placeholder: { key: 'placeholder' },
} as const satisfies AttributeSettings;
