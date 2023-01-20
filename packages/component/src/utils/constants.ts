import { COMPONENT_ATTRIBUTE } from '$global/constants/attributes';
import { generateSelectors } from '$global/factory';

const ATTRIBUTES_PREFIX = `fs-${COMPONENT_ATTRIBUTE}`;

export const COMPONENT_ELEMENT_KEY = 'component';
export const EXAMPLE_SETTING_KEY = 'example';
export const EXAMPLE_SETTING_VALUES = { value: 'value' };
export const PSEUDO_CLASSES = [
  ':active',
  ':hover',
  ':focus',
  ':visited',
  ':link',
  ':first-child',
  ':last-child',
  'checked',
  'disabled',
];

export const ATTRIBUTES = {
  element: {
    key: `${ATTRIBUTES_PREFIX}-element`,
    values: {
      /**
       * This is an element example definition.
       */
      component: COMPONENT_ELEMENT_KEY,
    },
  },

  /**
   * Defines a setting example definition.
   */
  example: {
    key: `${ATTRIBUTES_PREFIX}-${EXAMPLE_SETTING_KEY}`,
    values: EXAMPLE_SETTING_VALUES,
  },
} as const;

export const [getSelector, queryElement, getAttribute] = generateSelectors(ATTRIBUTES);
