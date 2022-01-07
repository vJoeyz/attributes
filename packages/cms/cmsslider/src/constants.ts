import { generateDynamicAttibuteValue, generateSelectors } from '$global/factory/selectors';

const ATTRIBUTE = 'cmsslider';

const ATTRIBUTES_PREFIX = `fs-${ATTRIBUTE}`;

export const LIST_ELEMENT_KEY = 'list';
export const SLIDER_ELEMENT_KEY = 'slider';

export const ATTRIBUTES = {
  element: {
    key: `${ATTRIBUTES_PREFIX}-element`,
    values: {
      /**
       * Defines a list to be included into the target slider.
       */
      list: generateDynamicAttibuteValue(LIST_ELEMENT_KEY),

      /**
       * Defines the target slider where all lists will be included into.
       */
      slider: generateDynamicAttibuteValue(SLIDER_ELEMENT_KEY),
    },
  },
} as const;

export const [getSelector, queryElement] = generateSelectors(ATTRIBUTES);
