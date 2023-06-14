import { type AttributeElements, type AttributeSettings } from '@finsweet/attributes-utils';

export const ELEMENTS = [
  /**
   * Defines the element as the trigger of the event.
   */
  'trigger',

  /**
   * Defines the element as the target to mirror the fired event.
   */
  'target',
] as const satisfies AttributeElements;

export const SETTINGS = {
  /**
   * Defines a delay to wait until the click event is replicated on the target.
   */
  delay: { key: 'delay' },
} as const satisfies AttributeSettings;
