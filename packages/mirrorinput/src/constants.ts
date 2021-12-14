import { generateDynamicAttibuteValue, generateSelectors } from '$global/factory/selectors';

const ATTRIBUTES_PREFIX = 'fs-mirrorinput';

export const ATTRIBUTES = {
  /**
   * Defines an element that will act as trigger or target of the event mirroring.
   */
  element: {
    key: `${ATTRIBUTES_PREFIX}-element`,
    values: {
      /**
       * Defines the element as the trigger of the event.
       */
      trigger: 'trigger',

      /**
       * Defines the element as the target to mirror the fired event.
       */
      target: generateDynamicAttibuteValue('target'),
    },
  },
} as const;

export const [getSelector, queryElement] = generateSelectors(ATTRIBUTES);
