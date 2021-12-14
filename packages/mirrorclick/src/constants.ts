import { generateDynamicAttibuteValue, generateSelectors } from 'global/attributes';

const ATTRIBUTES_PREFIX = 'fs-mirrorclick';

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

  /**
   * Defines a delay to wait until the click event is replicated on the target.
   */
  delay: { key: `${ATTRIBUTES_PREFIX}-delay` },
} as const;

export const [getSelector, queryElement] = generateSelectors(ATTRIBUTES);
