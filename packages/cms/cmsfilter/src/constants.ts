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
       * Defines an element where to display the total items of the list.
       */
      itemsCount: generateDynamicAttibuteValue('items-count'),

      /**
       * Defines a tag template element.
       */
      tagTemplate: generateDynamicAttibuteValue('tag-template'),

      /**
       * Defines the text node of a tag.
       */
      tagText: generateDynamicAttibuteValue('tag-text'),

      /**
       * Defines a remove trigger element of a tag.
       */
      tagRemove: generateDynamicAttibuteValue('tag-remove'),

      /**
       * Defines an element where to scroll the view every time a filter is applied.
       */
      scrollAnchor: generateDynamicAttibuteValue('scroll-anchor'),

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
   * Available values: {@link MATCHES}.
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
   * Available values: {@link MODES.range}.
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
   * Defines the format of the tags.
   * Available values: {@link TAGS_MODES}.
   * Defaults to `default`.
   */
  tagsFormat: { key: `${ATTRIBUTES_PREFIX}-tagformat` },

  /**
   * Defines the easing function of the list animation.
   * Allowed values are defined in {@link "packages/animations"}.
   */
  easing: { key: `${ATTRIBUTES_PREFIX}-easing` },

  /**
   * Defines the duration of the list animation.
   */
  duration: { key: `${ATTRIBUTES_PREFIX}-duration` },
} as const;

export const getSelector = generateSelectors(ATTRIBUTES);

export const MATCHES = ['any', 'all'] as const;
export const MODES = {
  range: ['from', 'to'],
} as const;

export const TAGS_MODES = ['category'] as const;
