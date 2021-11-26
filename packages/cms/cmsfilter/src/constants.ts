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
      resultsCount: generateDynamicAttibuteValue('results-count'),

      /**
       * Defines an element that will display the existing results for a specific filter.
       */
      filterResultsCount: generateDynamicAttibuteValue('filter-results-count'),

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
   * Defines if a filter element should be hidden when there are no results for it.
   */
  hideEmpty: { key: `${ATTRIBUTES_PREFIX}-hideempty`, values: { true: 'true' } },

  /**
   * Defines if the filter query should highlight the matching item props.
   * It's applied to the input elements.
   */
  highlight: { key: `${ATTRIBUTES_PREFIX}-highlight`, values: { true: 'true' } },

  /**
   * Defines the highlight CSS class to be used to highlight elements.
   * Defaults to {@link DEFAULT_HIGHLIGHT_CSS_CLASS}.
   */
  highlightCSS: { key: `${ATTRIBUTES_PREFIX}-highlightclass` },

  /**
   * Defines an active CSS class that will be added to checked checkboxes/radios's parent element.
   * Defaults to {@link DEFAULT_ACTIVE_CSS_CLASS}.
   */
  activeCSS: { key: `${ATTRIBUTES_PREFIX}-active` },

  /**
   * Defines the debouncing for input events.
   * Defaults to {@link DEFAULT_DEBOUNCING}.
   */
  debouncing: { key: `${ATTRIBUTES_PREFIX}-debouncing` },

  /**
   * Defines the format of the tags.
   * Available values: {@link TAG_FORMATS}.
   */
  tagFormat: { key: `${ATTRIBUTES_PREFIX}-tagformat` },

  /**
   * Overrides the key display of a filter when using the `category` tag format.
   */
  tagCategory: { key: `${ATTRIBUTES_PREFIX}-tagcategory` },

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

export const TAG_FORMATS = ['category'] as const;

export const DEFAULT_HIGHLIGHT_CSS_CLASS = 'fs-cmsfilter_highlight';
export const DEFAULT_ACTIVE_CSS_CLASS = 'fs-cmsfilter_active';

export const DEFAULT_DEBOUNCING = '50';
