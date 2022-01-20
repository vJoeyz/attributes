import { generateDynamicAttibuteValue, generateSelectors } from '$global/factory/selectors';

const ATTRIBUTES_PREFIX = 'fs-cmstabs';

export const RESET_IX_SETTING_KEY = 'resetix';
export const RESET_IX_SETTING_VALUES = { true: 'true' } as const;

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

  /**
   * Defines if Webflow should be restarted after populating the tabs.
   */
  resetIx: { key: `${ATTRIBUTES_PREFIX}-${RESET_IX_SETTING_KEY}`, values: RESET_IX_SETTING_VALUES },
} as const;

export const [getSelector, queryElement] = generateSelectors(ATTRIBUTES);
