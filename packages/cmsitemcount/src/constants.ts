import { createDynamicAttibuteValue } from '$utils/attributes';

const ATTRIBUTES_PREFIX = 'fs-cmsitemcount';

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
      value: createDynamicAttibuteValue('value'),
    },
  },
} as const;
