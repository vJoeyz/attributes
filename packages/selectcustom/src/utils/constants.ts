import { SELECT_CUSTOM_ATTRIBUTE } from '$global/constants/attributes';
import { ARROW_DOWN_KEY, ARROW_UP_KEY, SPACE_KEY, TAB_KEY } from '$global/constants/keyboard';
import { type AttributesDefinition, generateSelectors } from '$global/factory';

const ATTRIBUTES_PREFIX = `fs-${SELECT_CUSTOM_ATTRIBUTE}`;

export const DROPDOWN_ELEMENT_KEY = 'dropdown';
export const LABEL_ELEMENT_KEY = 'label';
export const RESET_OPTION_KEY_FALLBACK = 'option-reset';
export const RESET_OPTION_KEY = 'clear';

export const HIDE_INITIAL_SETTING_KEY = 'hideinitial';
export const HIDE_INITIAL_SETTING_VALUES = { true: 'true' };

export const ATTRIBUTES = {
  element: {
    key: `${ATTRIBUTES_PREFIX}-element`,
    values: {
      /**
       * Defines a dropdown element.
       */
      dropdown: DROPDOWN_ELEMENT_KEY,

      /**
       * Defines the label that displays the currently selected option.
       */
      label: LABEL_ELEMENT_KEY,

      /**
       * Defines an option that will remove the selected value.
       */
      resetOption: RESET_OPTION_KEY,

      /**
       * Defines an option that will remove the selected value. This is a fallback value for backwards compatibility.
       */
      resetOptionFallback: RESET_OPTION_KEY_FALLBACK,
    },
  },

  /**
   * Defines if the reset option should be hidden whenever there isn't an active selection.
   */
  hideInitial: { key: `${ATTRIBUTES_PREFIX}-${HIDE_INITIAL_SETTING_KEY}`, values: HIDE_INITIAL_SETTING_VALUES },
} as const satisfies AttributesDefinition;

export const [getSelector, queryElement] = generateSelectors(ATTRIBUTES);

export const CONTROL_KEYS = [SPACE_KEY, TAB_KEY, ARROW_UP_KEY, ARROW_DOWN_KEY];
