import { generateDynamicAttibuteValue, generateSelectors } from 'global/attributes';

const ATTRIBUTES_PREFIX = 'fs-untransform';

export const ATTRIBUTES = {
  element: {
    key: `${ATTRIBUTES_PREFIX}-element`,
    values: {
      /**
       * Defines the trigger that untransforms all parents of the fixed element.
       */
      on: 'trigger-on',

      /**
       * Defines the trigger that returns the transforms to all parents of the fixed element.
       */
      off: 'trigger-off',

      /**
       * Defines a trigger that toggles `on/off` the untransforms.
       */
      toggle: 'toggle',

      /**
       * Defines the element that has `position: fixed`.
       * If not defined, the `triggerOn` element is used {@link ATTRIBUTES.element.values.on}
       */
      fixed: generateDynamicAttibuteValue('fixed'),
    },
  },

  /**
   * Defines the timeout to wait before triggering the `off` state.
   */
  timeout: { key: `${ATTRIBUTES_PREFIX}-timeout`, values: {} },
} as const;

export const [getSelector, queryElement] = generateSelectors(ATTRIBUTES);

/**
 * The CSS class for untransforming the parents.
 */
export const UNTRANSFORM_CLASS = 'fs_untransform';

/**
 * Raw HTML for injecting the styles.
 */
export const UNTRANSFORM_STYLES = `<style>.${UNTRANSFORM_CLASS}{transform: unset !important; transform-style: unset !important;}</style>`;
