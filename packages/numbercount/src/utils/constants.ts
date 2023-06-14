import { type AttributeElements, type AttributeSettings } from '@finsweet/attributes-utils';

export const ELEMENTS = [
  /**
   * Defines an element with a number to be animated.
   */
  'number',
] as const satisfies AttributeElements;

export const SETTINGS = {
  /**
   * Defines the start number in the count.
   * If not defined, the library will default to {@link DEFAULT_START_NUMBER}.
   */
  start: { key: 'start' },

  /**
   * Defines the end number in the count.
   * If not defined, the library will try to extract it from the `number` element.
   */
  end: { key: 'end' },

  /**
   * Defines the count speed.
   * If not defined, it will default to {@link DEFAULT_DURATION}.
   */
  duration: { key: 'duration' },

  /**
   * Defines the intersection observer threshold.
   * If not defined, it will default to {@link DEFAULT_THRESHOLD}.
   */
  threshold: { key: 'threshold' },

  /**
   * If defined, the library will format the number using the provided locale.
   * Users can define any BCP 47 language tag or use `auto` to use the browser's locale.
   */
  locale: {
    key: 'locale',
    values: {
      auto: 'auto',
    },
  },
} as const satisfies AttributeSettings;

export const DEFAULT_START_NUMBER = 0;

export const DEFAULT_DURATION = 1000;

export const DEFAULT_THRESHOLD = 25;
