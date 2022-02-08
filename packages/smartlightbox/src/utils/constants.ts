import { generateDynamicAttibuteValue, generateSelectors } from '$global/factory/selectors';

export const ATTRIBUTE = 'smartlightbox';

const ATTRIBUTES_PREFIX = `fs-${ATTRIBUTE}`;

export const TRIGGER_ON_ELEMENT_KEY = 'trigger-open';
export const TRIGGER_OFF_ELEMENT_KEY = 'trigger-close';
export const TRIGGER_TOGGLE_ELEMENT_KEY = 'trigger-toggle';
export const LIGHTBOX_ELEMENT_KEY = 'lightbox';

export const WAIT_SETTING_KEY = 'wait';

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
      lightbox: generateDynamicAttibuteValue(LIGHTBOX_ELEMENT_KEY),
    },
  },

  /**
   * Defines the timeout to wait before triggering the `off` state.
   */
  wait: { key: `${ATTRIBUTES_PREFIX}-${WAIT_SETTING_KEY}` },
} as const;

export const [getSelector, queryElement] = generateSelectors(ATTRIBUTES);
