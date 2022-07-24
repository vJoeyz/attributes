import { generateSelectors, generateDynamicAttibuteValue } from '@global/factory';
import { CMS_ATTRIBUTE_ATTRIBUTE } from 'global/constants/attributes';

const ATTRIBUTES_PREFIX = `fs-${CMS_ATTRIBUTE_ATTRIBUTE}`;

export const FIELD_ELEMENT_KEY = 'field';
export const NAME_ELEMENT_KEY = 'name';
export const VALUE_ELEMENT_KEY = 'value';

export const ATTRIBUTES = {
  element: {
    key: `${ATTRIBUTES_PREFIX}-element`,
    values: {
      /**
       * Name of Attribute
       */
      name: generateDynamicAttibuteValue(NAME_ELEMENT_KEY),
      /**
       * Value of Attribute
       */
      value: generateDynamicAttibuteValue(VALUE_ELEMENT_KEY),
    },
  },

  /**
   * Defines a field key to group attribute.
   */
  field: { key: `${ATTRIBUTES_PREFIX}-${FIELD_ELEMENT_KEY}` },
} as const;

export const [getSelector, queryElement] = generateSelectors(ATTRIBUTES);
