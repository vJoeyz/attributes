import { CMS_NEST_ATTRIBUTE } from '$global/constants/attributes';
import { type AttributesDefinition, generateSelectors } from '$global/factory';

const ATTRIBUTES_PREFIX = `fs-${CMS_NEST_ATTRIBUTE}`;

export const LIST_ELEMENT_KEY = 'list';
export const NEST_TARGET_SETTING_KEY = 'nest-target';
export const SLUGS_SETTING_KEY = 'slugs';
export const COLLECTION_SETTING_KEY = 'collection';
export const EMPTY_SETTING_KEY = 'empty';

export const ATTRIBUTES = {
  element: {
    key: `${ATTRIBUTES_PREFIX}-element`,
    values: {
      /**
       * Defines a list to be combined into the target.
       */
      list: LIST_ELEMENT_KEY,

      /**
       * Defines a target element where a list will be nested into.
       */
      nestTarget: NEST_TARGET_SETTING_KEY,

      /**
       * Defines an element that contains a comma-separated list of slugs.
       */
      slugs: SLUGS_SETTING_KEY,
    },
  },

  /**
   * Defines a Collection List that will be nested inside the target list element.
   */
  collection: { key: `${ATTRIBUTES_PREFIX}-${COLLECTION_SETTING_KEY}` },

  /**
   * Defines an `Empty State` element.
   */
  empty: { key: `${ATTRIBUTES_PREFIX}-${EMPTY_SETTING_KEY}` },
} as const satisfies AttributesDefinition;

export const [getSelector, queryElement, getAttribute] = generateSelectors(ATTRIBUTES);
