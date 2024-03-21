import {
  ARROW_DOWN_KEY,
  ARROW_UP_KEY,
  type AttributeElements,
  type AttributeSettings,
  SPACE_KEY,
  TAB_KEY,
} from '@finsweet/attributes-utils';

export const ELEMENTS = [
  /**
   * Defines a dropdown element.
   */
  'dropdown',

  /**
   * Defines the label that displays the currently selected option.
   */
  'label',

  /**
   * Defines an option that will remove the selected value.
   */
  'clear',
] as const satisfies AttributeElements;

export const SETTINGS = {
  /**
   * Defines if the reset option should be hidden whenever there isn't an active selection.
   */
  hideinitial: { key: 'hideinitial', values: { true: 'true' } },
} as const satisfies AttributeSettings;

export const CONTROL_KEYS = [SPACE_KEY, TAB_KEY, ARROW_UP_KEY, ARROW_DOWN_KEY];
