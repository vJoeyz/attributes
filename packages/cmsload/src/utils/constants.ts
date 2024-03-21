import { type AttributeElements, type AttributeSettings, type WebflowBreakpoint } from '@finsweet/attributes-utils';

export const ELEMENTS = [
  /**
   * Defines a list to be instantiated.
   */
  'list',

  /**
   * Defines a node that will be displayed when loading new items.
   */
  'loader',

  /**
   * Defines an element where to display the total items of the list.
   */
  'items-count',

  /**
   * Defines an element where to display the amount of visible items.
   */
  'visible-count',

  /**
   * Defines an element where to display the lower range of visible items.
   */
  'visible-count-from',

  /**
   * Defines an element where to display the upper range of visible items.
   */
  'visible-count-to',

  /**
   * Defines an element where to scroll the view every time a page in `Pagination` mode is switched.
   */
  'scroll-anchor',

  /**
   * Defines the Empty State element for when there are no elements to show.
   */
  'empty',

  /**
   * Defines the template element to generate all page buttons for the `paginate` mode.
   */
  'page-button',

  /**
   * Defines the template element to create the page dots separators.
   */
  'page-dots',
] as const satisfies AttributeElements;

export const SETTINGS = {
  /**
   * Defines the loading mode.
   */
  mode: {
    key: 'mode',
    values: {
      /**
       * Renders items at the bottom of the page.
       */
      loadUnder: 'load-under',

      /**
       * All items will be rendered at once.
       */
      renderAll: 'render-all',

      /**
       * Pagination will be created.
       */
      pagination: 'pagination',

      /**
       * Items will be loaded when the user reaches the bottom of the Collection List.
       * Threshold can be defined with {@link ATTRIBUTES.threshold}.
       */
      infinite: 'infinite',
    },
  },

  /**
   * Defines the scrolling threshold to trigger a new page load in `infinite` mode.
   * Defaults to {@link DEFAULT_INFINITE_THRESHOLD}.
   */
  threshold: { key: 'threshold' },

  /**
   * Defines the amount of digits to display either side of the current page.
   * It can be a comma-separated string listing the values in a `Desktop, Tablet, Landscape, Portrait` order.
   *
   * Defaults to {@link DEFAULT_PAGE_SIBLINGS}.
   */
  pagesiblings: { key: 'pagesiblings' },

  /**
   * Defines the amount of digits to display at the start and end of a page buttons list.
   * It can be a comma-separated string listing the values in a `Desktop, Tablet, Landscape, Portrait` order.
   *
   * Defaults to {@link DEFAULT_PAGE_BOUNDARY}.
   */
  pageboundary: { key: 'pageboundary' },

  /**
   * Defines the animation to use when appending elements to the list.
   * Allowed values are defined in {@link "packages/animations"}.
   */
  animation: { key: 'animation' },

  /**
   * Defines the easing function of the animation.
   * Allowed values are defined in {@link "packages/animations"}.
   */
  easing: { key: 'easing' },

  /**
   * Defines the duration of the animation.
   */
  duration: { key: 'duration' },

  /**
   * Defines if animations should be staggered.
   */
  stagger: { key: 'stagger' },

  /**
   * Defines if Webflow should be restarted after loading new items.
   */
  resetix: {
    key: 'resetix',
    values: { true: 'true' },
  },

  /**
   * Defines if the pagination query params should be displayed on the URL.
   * Only works with {@link SETTINGS.mode.values.pagination} mode.
   */
  showquery: { key: 'showquery', values: { true: 'true' } },

  /**
   * Defines if the documents should be cached after fetching them.
   * Defaults to `true`.
   */
  cache: {
    key: 'cache',
    values: { false: 'false' },
  },
} as const satisfies AttributeSettings;

export const DEFAULT_INFINITE_THRESHOLD = -20;

export const DEFAULT_PAGE_SIBLINGS = 1;
export const DEFAULT_PAGE_BOUNDARY = 1;

export const BREAKPOINTS_INDEX: { [key in WebflowBreakpoint]: number } = {
  main: 0,
  medium: 1,
  small: 2,
  tiny: 3,
} as const;
