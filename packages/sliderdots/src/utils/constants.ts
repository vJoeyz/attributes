import { type AttributeElements, type AttributeSettings, SLIDER_DOTS_ATTRIBUTE } from '@finsweet/attributes-utils';

export const ELEMENTS = [
  /**
   * Defines a slider to instantiate.
   */
  'slider',

  /**
   * Defines the content to be added to the slider dot.
   */
  'content',

  /**
   * Defines a custom Slide Nav.
   */
  'slider-nav',
] as const satisfies AttributeElements;

export const SETTINGS = {
  /**
   * Defines the `active` CSS class. Defaults to {@link DEFAULT_ACTIVE_CSS_CLASS}.
   */
  active: { key: 'active' },

  /**
   * Defines if the content should be removed or just duplicated.
   */
  remove: {
    key: 'remove',
    values: { true: 'true' },
  },
} as const satisfies AttributeSettings;

export const DEFAULT_ACTIVE_CSS_CLASS = `fs-${SLIDER_DOTS_ATTRIBUTE}_active`;
