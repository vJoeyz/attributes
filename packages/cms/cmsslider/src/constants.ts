import { generateDynamicAttibuteValue, generateSelectors } from '$global/factory/selectors';

const ATTRIBUTES_PREFIX = 'fs-cmsslider';

export const RESET_IX_SETTING_KEY = 'resetix';
export const RESET_IX_SETTING_VALUES = { true: 'true' } as const;

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

  /**
   * Defines if Webflow should be restarted after populating the sliders.
   */
  resetIx: { key: `${ATTRIBUTES_PREFIX}-${RESET_IX_SETTING_KEY}`, values: RESET_IX_SETTING_VALUES },
} as const;

export const [getSelector, queryElement] = generateSelectors(ATTRIBUTES);
