import { generateSelectors } from '$utils/attributes';
import { ARROW_DOWN_KEY, ARROW_UP_KEY, SPACE_KEY, TAB_KEY } from '$utils/keyboard';

export const ATTRIBUTE = 'selectcustom';

const ATTRIBUTES_PREFIX = `fs-${ATTRIBUTE}`;

export const DROPDOWN_ELEMENT_KEY = 'dropdown';
export const LABEL_ELEMENT_KEY = 'label';
export const TEXT_ELEMENT_KEY = 'text';
export const OPTION_TEMPLATE_KEY = 'option-template';
export const LABEL_CONTENT_KEY = 'label-content';

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
       * Defines the text node that must display an option's text.
       */
      text: TEXT_ELEMENT_KEY,

      /**
       * Defines the template element to create new options.
       */
      optionTemplate: OPTION_TEMPLATE_KEY,

      /**
       * Defines the text element that acts as the label content.
       */
      labelContent: LABEL_CONTENT_KEY,
    },
  },
} as const;

export const [getSelector, queryElement] = generateSelectors(ATTRIBUTES);

export const CONTROL_KEYS = [SPACE_KEY, TAB_KEY, ARROW_UP_KEY, ARROW_DOWN_KEY];
