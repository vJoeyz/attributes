import { type AttributeElements, type AttributeSettings, INPUT_ACTIVE_ATTRIBUTE } from '@finsweet/attributes-utils';

export const ELEMENTS = [] as const satisfies AttributeElements;

export const SETTINGS = {
  /**
   * Defines a custom active class.
   */
  class: {
    key: 'class',
    defaultValue: `is-${INPUT_ACTIVE_ATTRIBUTE}-active`,
  },
} as const satisfies AttributeSettings;
