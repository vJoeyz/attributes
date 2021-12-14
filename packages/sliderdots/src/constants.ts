import { generateDynamicAttibuteValue, generateSelectors } from 'global/attributes';

const ATTRIBUTES_PREFIX = 'fs-sliderdots';

export const ATTRIBUTES = {
  element: {
    key: `${ATTRIBUTES_PREFIX}-element`,
    values: {
      /**
       * Defines a slider to instantiate.
       */
      slider: generateDynamicAttibuteValue('slider'),

      /**
       * Defines the content to be added to the slider dot.
       */
      content: generateDynamicAttibuteValue('content'),

      /**
       * Defines a custom Slide Nav.
       */
      sliderNav: generateDynamicAttibuteValue('slider-nav'),
    },
  },

  /**
   * Defines the `active` CSS class. Defaults to {@link DEFAULT_ACTIVE_CSS_CLASS}.
   */
  active: { key: `${ATTRIBUTES_PREFIX}-active` },

  /**
   * Defines if the content should be removed or just duplicated.
   */
  remove: {
    key: `${ATTRIBUTES_PREFIX}-remove`,
    values: { true: 'true' },
  },
} as const;

export const [getSelector, queryElement] = generateSelectors(ATTRIBUTES);

export const DEFAULT_ACTIVE_CSS_CLASS = `${ATTRIBUTES_PREFIX}_active`;
