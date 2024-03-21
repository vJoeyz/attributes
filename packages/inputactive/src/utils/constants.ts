import { type AttributeElements, type AttributeSettings, INPUT_ACTIVE_ATTRIBUTE } from '@finsweet/attributes-utils';

export const ELEMENTS = [] as const satisfies AttributeElements;

export const SETTINGS = {
  /**
   * Defines a custom active class.
   */
  class: {
    key: 'class',
  },
} as const satisfies AttributeSettings;

export const DEFAULT_ACTIVE_CLASS = `is-active-${INPUT_ACTIVE_ATTRIBUTE}`;
