import { generateDynamicAttibuteValue, generateSelectors } from '$global/factory/selectors';

export const ATTRIBUTE = 'untransform';

const ATTRIBUTES_PREFIX = `fs-${ATTRIBUTE}`;

export const TRIGGER_ON_ELEMENT_KEY = 'trigger-on';
export const TRIGGER_OFF_ELEMENT_KEY = 'trigger-off';
export const TRIGGER_TOGGLE_ELEMENT_KEY = 'trigger-toggle';
export const FIXED_ELEMENT_KEY = 'fixed';

export const TIMEOUT_SETTING_KEY = 'timeout';

export const ATTRIBUTES = {
  element: {
    key: `${ATTRIBUTES_PREFIX}-element`,
    values: {
      /**
       * Defines the trigger that untransforms all parents of the fixed element.
       */
      on: TRIGGER_ON_ELEMENT_KEY,

      /**
       * Defines the trigger that returns the transforms to all parents of the fixed element.
       */
      off: TRIGGER_OFF_ELEMENT_KEY,

      /**
       * Defines a trigger that toggles `on/off` the untransforms.
       */
      toggle: TRIGGER_TOGGLE_ELEMENT_KEY,

      /**
       * Defines the element that has `position: fixed`.
       * If not defined, the `triggerOn` element is used {@link ATTRIBUTES.element.values.on}
       */
      fixed: generateDynamicAttibuteValue(FIXED_ELEMENT_KEY),
    },
  },

  /**
   * Defines the timeout to wait before triggering the `off` state.
   */
  timeout: { key: `${ATTRIBUTES_PREFIX}-${TIMEOUT_SETTING_KEY}` },
} as const;

export const [getSelector, queryElement] = generateSelectors(ATTRIBUTES);
