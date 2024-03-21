import { type AttributeElements, type AttributeSettings, STAR_RATING_ATTRIBUTE } from '@finsweet/attributes-utils';

export const ELEMENTS = [
  /**
   * Defines a stars wrapper.
   */
  'group',

  /**
   * Defines a star element.
   */
  'star',
] as const satisfies AttributeElements;

export const SETTINGS = {
  /**
   * Defines a setting example definition.
   */
  active: { key: 'active' },
} as const satisfies AttributeSettings;

export const DEFAULT_ACTIVE_CLASS = `is-active-${STAR_RATING_ATTRIBUTE}`;
