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
      slider: generateDynamicAttibuteValue('slider'),
    },
  },
} as const;

export const getSelector = generateSelectors(ATTRIBUTES);
