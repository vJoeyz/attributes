import { generateDynamicAttibuteValue, generateSelectors } from '$utils/attributes';

const ATTRIBUTES_PREFIX = 'fs-cmsslider';

export const ATTRIBUTES = {
  element: {
    key: `${ATTRIBUTES_PREFIX}-element`,
    values: {
      /**
       * Defines a list to be included into the target slider.
       */
      list: generateDynamicAttibuteValue('list'),

      /**
       * Defines the target slider where all lists will be included into.
       */
      target: generateDynamicAttibuteValue('target'),
    },
  },

  /**
   * Defines a global selector to query lists to include in the slider.
   */
  lists: { key: `${ATTRIBUTES_PREFIX}-lists` },

  /**
   * Defines a global slider where to include the lists.
   */
  slider: { key: `${ATTRIBUTES_PREFIX}-slider` },
} as const;

export const getSelector = generateSelectors(ATTRIBUTES);
