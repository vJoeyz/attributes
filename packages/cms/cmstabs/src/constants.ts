import { generateDynamicAttibuteValue, generateSelectors } from '$utils/attributes';

const ATTRIBUTES_PREFIX = 'fs-cmstabs';

export const ATTRIBUTES = {
  element: {
    key: `${ATTRIBUTES_PREFIX}-element`,
    values: {
      /**
       * Defines a list to be included into the target tabs.
       */
      list: generateDynamicAttibuteValue('list'),

      /**
       * Defines the target tabs where all lists will be included into.
       */
      tabs: generateDynamicAttibuteValue('tabs'),

      /**
       * Defines the content that will be placed inside the generated `Tab Link` in the `Tabs Menu`.
       */
      tabLink: 'tab-link',
    },
  },
} as const;

export const [getSelector, queryElement] = generateSelectors(ATTRIBUTES);
