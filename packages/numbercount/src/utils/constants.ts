import { NUMBER_COUNT_ATTRIBUTE } from '$global/constants/attributes';
import { type AttributesDefinition, generateSelectors } from '$global/factory';

const ATTRIBUTES_PREFIX = `fs-${NUMBER_COUNT_ATTRIBUTE}`;

export const NUMBER_ELEMENT_KEY = 'number';
export const START_SETTING_KEY = 'start';
export const END_SETTING_KEY = 'end';
export const DURATION_SETTING_KEY = 'duration';
export const THRESHOLD_SETTING_KEY = 'threshold';
export const LOCALE_SETTING_KEY = 'locale';

export const ATTRIBUTES = {
  element: {
    key: `${ATTRIBUTES_PREFIX}-element`,
    values: {
      /**
       * Defines an element with a number to be animated.
       */
      number: NUMBER_ELEMENT_KEY,
    },
  },

  /**
   * Defines the start number in the count.
   * If not defined, the library will default to {@link DEFAULT_START_NUMBER}.
   */
  start: {
    key: `${ATTRIBUTES_PREFIX}-${START_SETTING_KEY}`,
  },

  /**
   * Defines the end number in the count.
   * If not defined, the library will try to extract it from the `number` element.
   */
  end: {
    key: `${ATTRIBUTES_PREFIX}-${END_SETTING_KEY}`,
  },

  /**
   * Defines the count speed.
   * If not defined, it will default to {@link DEFAULT_DURATION}.
   */
  duration: {
    key: `${ATTRIBUTES_PREFIX}-${DURATION_SETTING_KEY}`,
  },

  /**
   * Defines the intersection observer threshold.
   * If not defined, it will default to {@link DEFAULT_THRESHOLD}.
   */
  threshold: {
    key: `${ATTRIBUTES_PREFIX}-${THRESHOLD_SETTING_KEY}`,
  },

  /**
   * If defined, the library will format the number using the provided locale.
   * Users can define any BCP 47 language tag or use `auto` to use the browser's locale.
   */
  locale: {
    key: `${ATTRIBUTES_PREFIX}-${LOCALE_SETTING_KEY}`,
    values: {
      auto: 'auto',
    },
  },
} as const satisfies AttributesDefinition;

export const [getSelector, queryElement, getAttribute] = generateSelectors(ATTRIBUTES);

export const DEFAULT_START_NUMBER = 0;

export const DEFAULT_DURATION = 1000;

export const DEFAULT_THRESHOLD = 25;
