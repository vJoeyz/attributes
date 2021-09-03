import { createDynamicAttibuteValue } from '$utils/attributes';

const ATTRIBUTES_PREFIX = 'fs-copyclip';

export const ATTRIBUTES = {
  /**
   * Defines an element that will act as trigger or target based on its value.
   */
  element: {
    key: `${ATTRIBUTES_PREFIX}-element`,
    values: {
      /**
       * Defines an element to act as the copy trigger.
       */
      trigger: 'click',

      /**
       * Defines an element to act as the copy target.
       */
      target: createDynamicAttibuteValue('copy-this'),
    },
  },

  /**
   * Defines the text that will be success to the clipboard.
   */
  text: { key: `${ATTRIBUTES_PREFIX}-text` },

  /**
   * Defines the message that will be displayed on success.
   * Applicable both on elements and the `<script>` tag.
   * If applied to the `<script>` tag, all elements will inherit this attribute.
   */
  successMessage: { key: `${ATTRIBUTES_PREFIX}-message` },

  /**
   * Defines the duration of the success state.
   * Applicable both on elements and the `<script>` tag.
   * If applied to the `<script>` tag, all elements will inherit this attribute.
   */
  successDuration: { key: `${ATTRIBUTES_PREFIX}-duration` },

  /**
   * Defines a selector for instantiating all queried elements as triggers.
   * Only applicable to the `<script>` tag.
   */
  globalSelector: { key: `${ATTRIBUTES_PREFIX}-selector` },
};

export const DEFAULT_SUCCESS_DURATION = 1000;
export const SUCCESS_CSS_CLASS = `${ATTRIBUTES_PREFIX}_success`;
