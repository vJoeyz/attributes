import { generateSelectors } from '$utils/attributes';

const ATTRIBUTES_PREFIX = 'fs-rangeslider';

export const ATTRIBUTES = {
  element: {
    key: `${ATTRIBUTES_PREFIX}-element`,
    values: {
      /**
       * Defines a range slider instance element.
       */
      wrapper: 'wrapper',

      /**
       * Defines the track of the slider.
       */
      track: 'track',

      /**
       * Defines the fill of the slider.
       */
      fill: 'fill',

      /**
       * Defines a handle of the slider.
       */
      handle: 'handle',

      /**
       * Defines an element to display a Handle's value.
       */
      displayValue: 'display-value',
    },
  },

  /**
   * Defines the minimum value of the range.
   */
  min: { key: `${ATTRIBUTES_PREFIX}-min` },

  /**
   * Defines the maximum value of the range.
   */
  max: { key: `${ATTRIBUTES_PREFIX}-max` },

  /**
   * Defines the start value of a handle.
   * Must be applied to a handle element {@link ATTRIBUTES.element.handle}.
   */
  start: { key: `${ATTRIBUTES_PREFIX}-start` },

  /**
   * Defines the step of the values.
   */
  step: { key: `${ATTRIBUTES_PREFIX}-step` },

  /**
   * Defines if the Handles' value display should be formatted.
   */
  formatDisplay: { key: `${ATTRIBUTES_PREFIX}-formatdisplay`, values: { true: 'true' } },
} as const;

export const getSelector = generateSelectors(ATTRIBUTES);

export const HANDLE_INCREMENT_KEYS = ['ArrowUp', 'ArrowRight'];
export const HANDLE_DECREMENT_KEYS = ['ArrowDown', 'ArrowLeft'];
export const HANDLE_KEYS = [...HANDLE_INCREMENT_KEYS, ...HANDLE_DECREMENT_KEYS];
