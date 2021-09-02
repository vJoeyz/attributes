import { createDynamicAttibuteValue } from '$utils/attributes';

const ATTRIBUTES_PREFIX = 'fs-copyclip';

export const ATTRIBUTES_KEYS = {
  /**
   * Defines an element that will act as trigger or target based on its value: {@link ATTRIBUTES_VALUES}.
   */
  element: `${ATTRIBUTES_PREFIX}-element`,

  /**
   * Defines the text that will be success to the clipboard.
   */
  text: `${ATTRIBUTES_PREFIX}-text`,

  /**
   * Defines the message that will be displayed on success.
   * Applicable both on elements and the `<script>` tag.
   * If applied to the `<script>` tag, all elements will inherit this attribute.
   */
  successMessage: `${ATTRIBUTES_PREFIX}-message`,

  /**
   * Defines the duration of the success state.
   * Applicable both on elements and the `<script>` tag.
   * If applied to the `<script>` tag, all elements will inherit this attribute.
   */
  successDuration: `${ATTRIBUTES_PREFIX}-duration`,

  /**
   * Defines a selector for instantiating all queried elements as triggers.
   * Only applicable to the `<script>` tag.
   */
  globalSelector: `${ATTRIBUTES_PREFIX}-selector`,
} as const;

export const ATTRIBUTES_VALUES = {
  /**
   * Defines an element to act as the copy trigger.
   */
  trigger: 'click',

  /**
   * Defines an element to act as the copy target.
   */
  target: createDynamicAttibuteValue('copy-this'),
} as const;

export const DEFAULT_SUCCESS_DURATION = 1000;
export const SUCCESS_CSS_CLASS = `${ATTRIBUTES_PREFIX}_success`;
