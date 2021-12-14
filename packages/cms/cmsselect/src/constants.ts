import { generateDynamicAttibuteValue, generateSelectors } from 'global/attributes';

const ATTRIBUTES_PREFIX = 'fs-cmsselect';

export const ATTRIBUTES = {
  element: {
    key: `${ATTRIBUTES_PREFIX}-element`,
    values: {
      /**
       * Defines the elements as the source to populate the target.
       */
      textValue: generateDynamicAttibuteValue('text-value'),

      /**
       * Defines the element as the target to be populated.
       */
      select: 'select',
    },
  },
} as const;

export const [getSelector, queryElement] = generateSelectors(ATTRIBUTES);
