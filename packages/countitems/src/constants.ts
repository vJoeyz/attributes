import { generateDynamicAttibuteValue, generateSelectors } from 'global/attributes';

const ATTRIBUTES_PREFIX = 'fs-countitems';

export const ATTRIBUTES = {
  element: {
    key: `${ATTRIBUTES_PREFIX}-element`,
    values: {
      /**
       * Defines the CMS list or list-wrapper.
       */
      list: 'list',

      /**
       * Defines the element that will display the amount of CMS items.
       */
      value: generateDynamicAttibuteValue('value'),
    },
  },
} as const;

export const [getSelector, queryElement] = generateSelectors(ATTRIBUTES);
