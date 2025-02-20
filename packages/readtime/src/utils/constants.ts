import { type AttributeElements, type AttributeSettings } from '@finsweet/attributes-utils';

export const ELEMENTS = [
  /**
   * Defines any wrapper that contains the content to be metered.
   */
  'contents',

  /**
   * Defines the element that will display the time.
   */
  'time',
] as const satisfies AttributeElements;

export const SETTINGS = {
  /**
   * Defines the Words Per Minute ratio.
   * Defaults to {@link DEFAULT_WPM}.
   */
  wpm: {
    key: 'wpm',
    defaultValue: '265',
    isNumeric: true,
  },

  /**
   * Defines the amount of decimals displayed in the time output.
   * Defaults to {@link DEFAULT_DECIMALS}.
   */
  decimals: {
    key: 'decimals',
    defaultValue: '0',
    isNumeric: true,
  },
} as const satisfies AttributeSettings;

export const DEFAULT_WPM = 265;
export const DEFAULT_DECIMALS = 0;
