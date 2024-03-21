import { type AttributeElements, type AttributeSettings } from '@finsweet/attributes-utils';

export const ELEMENTS = [
  /**
   * Defines a list to be filtered.
   */
  'list',

  /**
   * Defines the `Form` that holds the filters.
   */
  'filters',

  /**
   * Defines the Empty State element for when there are no filetered elements to show.
   */
  'empty',

  /**
   * Defines an optional Initial State element for when there are no applied filters.
   */
  'initial',

  /**
   * Defines an element that will display all existing results.
   */
  'results-count',

  /**
   * Defines an element that will display the existing results for a specific filter.
   */
  'filter-results-count',

  /**
   * Defines an element where to display the total items of the list.
   */
  'items-count',

  /**
   * Defines a tag template element.
   */
  'tag-template',

  /**
   * Defines the text node of a tag.
   */
  'tag-text',

  /**
   * Defines a remove trigger element of a tag.
   */
  'tag-remove',

  /**
   * Defines an element where to scroll the view every time a filter is applied.
   */
  'scroll-anchor',

  /**
   * Defines a button that resets all filters when clicked.
   */
  'clear',
] as const satisfies AttributeElements;

export const SETTINGS = {
  /**
   * Defines a field key to group filters.
   */
  field: { key: 'field' },

  /**
   * Defines a specific field key to be resetted when clicking a Reset button.
   */
  clear: { key: 'clear' },

  /**
   * Defines the matching mode.
   * `any` by default.
   */
  match: {
    key: 'match',
    values: {
      any: 'any',
      all: 'all',
    },
  },

  /**
   * Defines a range to filter.
   */
  range: {
    key: 'range',
    values: {
      from: 'from',
      to: 'to',
    },
  },

  /**
   * Defines a specific field type.
   */
  type: {
    key: 'type',
    values: { date: 'date' },
  },

  /**
   * Defines if the filter query params should be displayed on the URL.
   */
  showquery: {
    key: 'showquery',
    values: { true: 'true' },
  },

  /**
   * Defines if the filters form should not prevent default behavior when submitting it.
   */
  allowsubmit: { key: 'allowsubmit', values: { true: 'true' } },

  /**
   * Defines if a filter element should be hidden when there are no results for it.
   */
  hideempty: { key: 'hideempty', values: { true: 'true' } },

  /**
   * Defines if the filter query should highlight the matching item props.
   * It's applied to the input elements.
   */
  highlight: { key: 'highlight', values: { true: 'true' } },

  /**
   * Defines the highlight CSS class to be used to highlight elements.
   * Defaults to {@link DEFAULT_HIGHLIGHT_CSS_CLASS}.
   */
  highlightclass: { key: 'highlightclass' },

  /**
   * Defines an active CSS class that will be added to checked checkboxes/radios's parent element.
   * Defaults to {@link DEFAULT_ACTIVE_CSS_CLASS}.
   */
  active: { key: 'active' },

  /**
   * Defines the debouncing for input events.
   * Defaults to {@link DEFAULT_DEBOUNCING}.
   */
  debounce: { key: 'debounce' },

  /**
   * Defines the format of the tags.
   * Available values: {@link TAG_FORMATS}.
   */
  tagformat: { key: 'tagformat', values: { category: 'category' } },

  /**
   * Overrides the key display of a filter when using the `category` tag format.
   */
  tagcategory: { key: 'tagcategory' },

  /**
   * Defines the easing function of the list animation.
   * Allowed values are defined in {@link "packages/animations"}.
   */
  easing: { key: 'easing' },

  /**
   * Defines the duration of the list animation.
   */
  duration: { key: 'duration' },
} as const satisfies AttributeSettings;

export const MATCHES = Object.values(SETTINGS.match.values);
export const MODES = {
  range: Object.values(SETTINGS.range.values),
} as const;

export const TAG_FORMATS = Object.values(SETTINGS.tagformat.values);

export const DEFAULT_HIGHLIGHT_CSS_CLASS = 'fs-cmsfilter_highlight';
export const DEFAULT_ACTIVE_CSS_CLASS = 'fs-cmsfilter_active';

export const DEFAULT_DEBOUNCING = 50;
