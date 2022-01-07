import { generateDynamicAttibuteValue, generateSelectors } from '$global/factory/selectors';

const ATTRIBUTE = 'cmstabs';

const ATTRIBUTES_PREFIX = `fs-${ATTRIBUTE}`;

export const LIST_ELEMENT_KEY = 'list';
export const TABS_ELEMENT_KEY = 'tabs';
export const TAB_LINK_ELEMENT_KEY = 'tab-link';

export const ATTRIBUTES = {
  element: {
    key: `${ATTRIBUTES_PREFIX}-element`,
    values: {
      /**
       * Defines a list to be included into the target tabs.
       */
      list: generateDynamicAttibuteValue(LIST_ELEMENT_KEY),

      /**
       * Defines the target tabs where all lists will be included into.
       */
      tabs: generateDynamicAttibuteValue(TABS_ELEMENT_KEY),

      /**
       * Defines the content that will be placed inside the generated `Tab Link` in the `Tabs Menu`.
       */
      tabLink: TAB_LINK_ELEMENT_KEY,
    },
  },
} as const;

export const [getSelector, queryElement] = generateSelectors(ATTRIBUTES);
