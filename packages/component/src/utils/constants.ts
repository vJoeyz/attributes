import { COMPONENT_ATTRIBUTE } from '$global/constants/attributes';
import { generateSelectors } from '$global/factory';

const ATTRIBUTES_PREFIX = `fs-${COMPONENT_ATTRIBUTE}`;

export const SOURCE_SETTING_KEY = 'source';
export const COMPONENT_ID_SETTING_KEY = 'id';
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
  /**
   * Defines a component source.
   */
  source: {
    key: `${ATTRIBUTES_PREFIX}-${SOURCE_SETTING_KEY}`,
  },

  /**
   * Defines a component source.
   */
  componentId: {
    key: `${ATTRIBUTES_PREFIX}-${COMPONENT_ID_SETTING_KEY}`,
  },
} as const;

export const [getSelector, queryElement, getAttribute] = generateSelectors(ATTRIBUTES);
