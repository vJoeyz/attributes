import { CMS_CSS_ATTRIBUTE } from '$global/constants/attributes';
import { type AttributesDefinition, generateDynamicAttibuteValue, generateSelectors } from '$global/factory';

const ATTRIBUTES_PREFIX = `fs-${CMS_CSS_ATTRIBUTE}`;

export const ATTRIBUTES = {
  element: {
    key: `${ATTRIBUTES_PREFIX}-element`,
    values: {
      /**
       * Defines a list to be combined into the target.
       */
      list: generateDynamicAttibuteValue('list'),
    },
  },

  pseudo: { key: `${ATTRIBUTES_PREFIX}-pseudo` },

  class: { key: `${ATTRIBUTES_PREFIX}-class` },
} as const satisfies AttributesDefinition;

export const [getSelector, queryElement] = generateSelectors(ATTRIBUTES);
