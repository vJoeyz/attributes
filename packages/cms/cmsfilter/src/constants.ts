import { generateDynamicAttibuteValue, generateSelectors } from '$utils/attributes';

const ATTRIBUTES_PREFIX = 'fs-cmsfilter';

export const ATTRIBUTES = {
  element: {
    key: `${ATTRIBUTES_PREFIX}-element`,
    values: {
      /**
       * Defines a list to be filtered.
       */
      list: generateDynamicAttibuteValue('list'),

      /**
       * Defines the `Form` that holds the filters.
       */
      filters: generateDynamicAttibuteValue('filters'),

      /**
       * Defines the Empty State element for when there are no filetered elements to show.
       */
      empty: generateDynamicAttibuteValue('empty'),

      /**
       * Defines an element that will display all existing results.
       */
      results: generateDynamicAttibuteValue('results-count'),

      /**
       * Defines a button that resets all filters when clicked.
       */
      reset: 'reset',
    },
  },

  /**
   * Defines a field key to group filters.
   */
  field: { key: `${ATTRIBUTES_PREFIX}-field` },

  /**
   * Defines a specific field key to be resetted when clicking a Reset button.
   */
  reset: { key: `${ATTRIBUTES_PREFIX}-reset` },

  /**
   * Defines the matching mode.
   * `any` by default.
   */
  match: {
    key: `${ATTRIBUTES_PREFIX}-match`,
    values: {
      any: 'any',
      all: 'all',
    },
  },

  /**
   * Defines a range to filter.
   */
  range: {
    key: `${ATTRIBUTES_PREFIX}-range`,
    values: {
      from: 'from',
      to: 'to',
    },
  },

  /**
   * Defines a specific field type.
   */
  type: { key: `${ATTRIBUTES_PREFIX}-type`, values: { date: 'date' } },

  /**
   * Defines if the filter query params should be displayed on the URL.
   */
  showQuery: { key: `${ATTRIBUTES_PREFIX}-showquery`, values: { true: 'true' } },

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
   * Defines if the window should scroll to the top of the list after applying filters.
   */
  scrollTop: { key: `${ATTRIBUTES_PREFIX}-scrolltop`, values: { true: 'true' } },
} as const;

export const getSelector = generateSelectors(ATTRIBUTES);

export const MATCHES = ['any', 'all'] as const;
export const MODES = {
  range: ['from', 'to'],
} as const;

export const DEFAULT_ANIMATION_DURATION = 0.1;
