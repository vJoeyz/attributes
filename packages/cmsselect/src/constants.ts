import { CMS_SELECT_ATTRIBUTE } from '$global/constants/attributes';
import { type AttributesDefinition, generateDynamicAttibuteValue, generateSelectors } from '$global/factory';

const ATTRIBUTES_PREFIX = `fs-${CMS_SELECT_ATTRIBUTE}`;

export const TEXT_VALUE_ELEMENT_KEY = 'text-value';
export const SELECT_ELEMENT_KEY = 'select';

export const ATTRIBUTES = {
  element: {
    key: `${ATTRIBUTES_PREFIX}-element`,
    values: {
      /**
       * Defines the elements as the source to populate the target.
       */
      textValue: generateDynamicAttibuteValue(TEXT_VALUE_ELEMENT_KEY),

      /**
       * Defines the element as the target to be populated.
       */
      select: SELECT_ELEMENT_KEY,
    },
  },
} as const satisfies AttributesDefinition;

export const [getSelector, queryElement] = generateSelectors(ATTRIBUTES);
