import { type AttributeElements, type AttributeSettings } from '@finsweet/attributes-utils';

export const ELEMENTS = [
  /**
   * Defines a list to be combined into the target.
   */
  'list',

  /**
   * Defines the `Previous` placeholder target.
   */
  'trigger',

  /**
   * Defines a Dropdown label.
   */
  'dropdown-label',

  /**
   * Defines an element where to scroll the view every time a filter is applied.
   */
  'scroll-anchor',
] as const satisfies AttributeElements;

export const SETTINGS = {
  /**
   * Defines a field key to sort items.
   */
  field: { key: 'field' },

  /**
   * Defines the type of the values to sort.
   */
  type: {
    key: 'type',
    values: {
      date: 'date',
    },
  },

  /**
   * Defines the easing function of the list animation.
   * Allowed values are defined in {@link "packages/animations"}.
   */
  easing: { key: 'easing' },

  /**
   * Defines the duration of the list animation.
   */
  duration: { key: 'duration' },

  /**
   * Defines the CSS Class for the `asc` state.
   * Defaults to {@link DEFAULT_ASC_CLASS}.
   */
  asc: { key: 'asc' },

  /**
   * Defines the CSS Class for the `desc` state.
   * Defaults to {@link DEFAULT_DESC_CLASS}.
   */
  desc: { key: 'desc' },

  /**
   * Defines if a button should trigger `desc` sorting on first click.
   */
  reverse: { key: 'reverse', values: { true: 'true' } },
} as const satisfies AttributeSettings;

export const DEFAULT_ASC_CLASS = 'fs-cmssort_asc';
export const DEFAULT_DESC_CLASS = 'fs-cmssort_desc';
