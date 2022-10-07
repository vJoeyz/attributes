import { LAUNCHDARKLY_ATTRIBUTE } from '$global/constants/attributes';
import { generateSelectors } from '$global/factory';

const ATTRIBUTES_PREFIX = `fs-${LAUNCHDARKLY_ATTRIBUTE}`;

export const EXAMPLE_ELEMENT_KEY = 'examplee';
export const EXAMPLE_SETTING_KEY = 'example';
export const EXAMPLE_SETTING_VALUES = { value: 'value' };
export const CLIENT_ID = `clientId`;
export const FLAG = `flag`;
export const SHOW_IF = `showif`;
export const SET_PROPERTY = `setproperty`;
export const TEXT_PROPERTY = `text`;
export const SRC_PROPERTY = `src`;

export const SUPPORTED_PROPERTIES = [TEXT_PROPERTY, SRC_PROPERTY];

export const ATTRIBUTES = {
  element: {
    key: `${ATTRIBUTES_PREFIX}-element`,
    values: {
      /**
       * This is an element example definition.
       */
      example: EXAMPLE_ELEMENT_KEY,
    },
  },

  /**
   * Defines a setting example definition.
   */
  example: {
    key: `${ATTRIBUTES_PREFIX}-${EXAMPLE_SETTING_KEY}`,
    values: EXAMPLE_SETTING_VALUES,
  },

  /**
   * Defines clientId for the LaunchDarkly environment.
   */
  clientId: {
    key: `${ATTRIBUTES_PREFIX}-${CLIENT_ID}`,
  },
  flag: {
    key: `${ATTRIBUTES_PREFIX}-${FLAG}`,
  },

  showIf: {
    key: `${ATTRIBUTES_PREFIX}-${SHOW_IF}`,
  },
  setProperty: {
    key: `${ATTRIBUTES_PREFIX}-${SET_PROPERTY}`,
  },
} as const;

export const [getSelector, queryElement] = generateSelectors(ATTRIBUTES);
