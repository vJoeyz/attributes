import { type AttributeElements, type AttributeSettings, COPY_CLIP_ATTRIBUTE } from '@finsweet/attributes-utils';

export const ELEMENTS = [
  /**
   * Defines an element to act as the copy trigger.
   */
  'click',

  /**
   * Defines an element to act as the copy target.
   */
  'copy-this',

  /**
   * Defines a sibling element to act as the copy target.
   */
  'copy-sibling',
] as const satisfies AttributeElements;

export const SETTINGS = {
  /**
   * Defines the text that will be copied to the clipboard.
   */
  text: { key: 'text' },

  /**
   * Defines the message that will be displayed on success.
   */
  message: { key: 'message' },

  /**
   * Defines the duration of the success state.
   */
  duration: { key: 'duration', defaultValue: '1000', isNumeric: true },

  /**
   * Defines the CSS Class added to the trigger on the success state.
   */
  activeclass: { key: 'activeclass', defaultValue: `is-${COPY_CLIP_ATTRIBUTE}-active` },
} as const satisfies AttributeSettings;
