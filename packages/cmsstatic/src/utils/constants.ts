import { CMS_STATIC_ATTRIBUTE } from '$global/constants/attributes';
import { type AttributesDefinition, generateDynamicAttibuteValue, generateSelectors } from '$global/factory';

const ATTRIBUTES_PREFIX = `fs-${CMS_STATIC_ATTRIBUTE}`;

export const LIST_ELEMENT_KEY = 'list';
export const STATIC_ITEM_ELEMENT_KEY = 'static-item';
export const ORDER_SETTING_KEY = 'order';
export const INTERACTIVE_SETTING_KEY = 'interactive';
export const INTERACTIVE_SETTING_VALUES = { true: 'true' } as const;
export const REPEAT_SETTING_KEY = 'repeat';

export const ATTRIBUTES = {
  element: {
    key: `${ATTRIBUTES_PREFIX}-element`,
    values: {
      /**
       * Defines a list to have a static element
       */
      list: generateDynamicAttibuteValue(LIST_ELEMENT_KEY),
      /**
       * Defines the static element
       */
      staticItem: generateDynamicAttibuteValue(STATIC_ITEM_ELEMENT_KEY),
    },
  },

  /**
   * Defines the order of the static element in list.
   */
  order: {
    key: `${ATTRIBUTES_PREFIX}-${ORDER_SETTING_KEY}`,
  },

  /**
   * Defines if the element will be strict static or will interact with load, filters, order.
   */
  interactive: {
    key: `${ATTRIBUTES_PREFIX}-${INTERACTIVE_SETTING_KEY}`,
    values: INTERACTIVE_SETTING_VALUES,
  },

  /**
   * Defines if the element will be repeated in the list.
   */
  repeat: {
    key: `${ATTRIBUTES_PREFIX}-${REPEAT_SETTING_KEY}`,
  },
} as const satisfies AttributesDefinition;

export const [getSelector, queryElement, getAttribute] = generateSelectors(ATTRIBUTES);
