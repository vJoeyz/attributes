import { generateDynamicAttibuteValue, generateSelectors } from '$global/factory/selectors';

const ATTRIBUTES_PREFIX = 'fs-cmssort';

export const ATTRIBUTES = {
  element: {
    key: `${ATTRIBUTES_PREFIX}-element`,
    values: {
      /**
       * Defines a list to be combined into the target.
       */
      list: generateDynamicAttibuteValue('list'),

      /**
       * Defines the `Previous` placeholder target.
       */
      trigger: generateDynamicAttibuteValue('trigger'),

      /**
       * Defines a Dropdown label.
       */
      dropdownLabel: generateDynamicAttibuteValue('dropdown-label'),

      /**
       * Defines an element where to scroll the view every time a filter is applied.
       */
      scrollAnchor: generateDynamicAttibuteValue('scroll-anchor'),
    },
  },

  /**
   * Defines a field key to sort items.
   */
  field: { key: `${ATTRIBUTES_PREFIX}-field` },

  /**
   * Defines the type of the values to sort.
   */
  type: {
    key: `${ATTRIBUTES_PREFIX}-type`,
    values: {
      date: 'date',
    },
  },

  /**
   * Defines the easing function of the list animation.
   * Allowed values are defined in {@link "packages/animations"}.
   */
  easing: { key: `${ATTRIBUTES_PREFIX}-easing` },

  /**
   * Defines the duration of the list animation.
   */
  duration: { key: `${ATTRIBUTES_PREFIX}-duration` },

  /**
   * Defines the CSS Class for the `asc` state.
   * Defaults to {@link DEFAULT_ASC_CLASS}.
   */
  ascClass: { key: `${ATTRIBUTES_PREFIX}-asc` },

  /**
   * Defines the CSS Class for the `desc` state.
   * Defaults to {@link DEFAULT_DESC_CLASS}.
   */
  descClass: { key: `${ATTRIBUTES_PREFIX}-desc` },

  /**
   * Defines if a button should trigger `desc` sorting on first click.
   */
  reverse: { key: `${ATTRIBUTES_PREFIX}-reverse`, values: { true: 'true' } },
} as const;

export const [getSelector, queryElement] = generateSelectors(ATTRIBUTES);

export const DEFAULT_ASC_CLASS = `${ATTRIBUTES_PREFIX}_asc`;
export const DEFAULT_DESC_CLASS = `${ATTRIBUTES_PREFIX}_desc`;
