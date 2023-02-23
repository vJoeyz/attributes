import { LINK_BLOCK_EDIT_ATTRIBUTE } from '$global/constants/attributes';
import { type AttributesDefinition, generateSelectors } from '$global/factory';

const ATTRIBUTES_PREFIX = `fs-${LINK_BLOCK_EDIT_ATTRIBUTE}`;

export const PARENT_ELEMENT_KEY = 'parent';
export const SELECTOR_SETTING_KEY = 'selector';

export const ATTRIBUTES = {
  element: {
    key: `${ATTRIBUTES_PREFIX}-element`,
    values: {
      /**
       * Defines the parent element that will act as the `Link Block`.
       */
      parent: PARENT_ELEMENT_KEY,
    },
  },

  /**
   * Defines a global selector to query multiple `parent` elements.
   */
  selector: { key: `${ATTRIBUTES_PREFIX}-${SELECTOR_SETTING_KEY}` },
} as const satisfies AttributesDefinition;

export const [getSelector, queryElement] = generateSelectors(ATTRIBUTES);
