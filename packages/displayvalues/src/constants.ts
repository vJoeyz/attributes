import { generateDynamicAttibuteValue, generateSelectors } from '$global/factory/selectors';

const ATTRIBUTES_PREFIX = 'fs-displayvalues';

export const ATTRIBUTES = {
  element: {
    key: `${ATTRIBUTES_PREFIX}-element`,
    values: {
      /**
       * Defines the element as the source of the event.
       */
      source: 'source',

      /**
       * Defines the element as the target to display the source value.
       */
      target: generateDynamicAttibuteValue('target'),
    },
  },

  /**
   * Defines a placeholder text to display when no value exists.
   */
  placeholder: { key: `${ATTRIBUTES_PREFIX}-placeholder` },
} as const;

export const [getSelector, queryElement] = generateSelectors(ATTRIBUTES);
