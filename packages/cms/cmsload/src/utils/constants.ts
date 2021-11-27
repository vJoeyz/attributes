import { generateDynamicAttibuteValue, generateSelectors } from '$utils/attributes';

import type { WebflowBreakpoint } from '@finsweet/ts-utils';

const ATTRIBUTES_PREFIX = 'fs-cmsload';

export const ATTRIBUTES = {
  element: {
    key: `${ATTRIBUTES_PREFIX}-element`,
    values: {
      /**
       * Defines a list to be instantiated.
       */
      list: generateDynamicAttibuteValue('list'),

      /**
       * Defines a node that will be displayed when loading new items.
       */
      loader: generateDynamicAttibuteValue('loader'),

      /**
       * Defines an element where to display the total items of the list.
       */
      itemsCount: generateDynamicAttibuteValue('items-count'),

      /**
       * Defines an element where to scroll the view every time a page in `Pagination` mode is switched.
       */
      scrollAnchor: generateDynamicAttibuteValue('scroll-anchor'),

      /**
       * Defines the template element to generate all page buttons for the `paginate` mode.
       */
      pageButton: 'page-button',

      /**
       * Defines the template element to create the page dots separators.
       */
      pageDots: 'page-dots',
    },
  },

  /**
   * Defines the text to display while loading.
   */
  loading: { key: `${ATTRIBUTES_PREFIX}-loading` },

  /**
   * Defines the text to display while loading.
   */
  mode: {
    key: `${ATTRIBUTES_PREFIX}-mode`,
    values: {
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
  threshold: { key: `${ATTRIBUTES_PREFIX}-threshold` },

  /**
   * Defines the amount of digits to display either side of the current page.
   * It can be a comma-separated string listing the values in a `Desktop, Tablet, Landscape, Portrait` order.
   *
   * Defaults to {@link DEFAULT_PAGE_SIBLINGS}.
   */
  pageSiblings: { key: `${ATTRIBUTES_PREFIX}-pagesiblings` },

  /**
   * Defines the amount of digits to display at the start and end of a page buttons list.
   * It can be a comma-separated string listing the values in a `Desktop, Tablet, Landscape, Portrait` order.
   *
   * Defaults to {@link DEFAULT_PAGE_BOUNDARY}.
   */
  pageBoundary: { key: `${ATTRIBUTES_PREFIX}-pageboundary` },

  /**
   * Defines the animation to use when appending elements to the list.
   * Allowed values are defined in {@link "packages/animations"}.
   */
  animation: { key: `${ATTRIBUTES_PREFIX}-animation` },

  /**
   * Defines the easing function of the animation.
   * Allowed values are defined in {@link "packages/animations"}.
   */
  easing: { key: `${ATTRIBUTES_PREFIX}-easing` },

  /**
   * Defines the duration of the animation.
   */
  duration: { key: `${ATTRIBUTES_PREFIX}-duration` },

  /**
   * Defines if animations should be staggered.
   */
  stagger: { key: `${ATTRIBUTES_PREFIX}-stagger` },

  /**
   * Defines if Webflow should be restarted after loading new items.
   */
  resetIx: { key: `${ATTRIBUTES_PREFIX}-resetix`, values: { true: 'true' } },
} as const;

export const getSelector = generateSelectors(ATTRIBUTES);

export const DEFAULT_INFINITE_THRESHOLD = '-20';

export const DEFAULT_PAGE_SIBLINGS = 1;
export const DEFAULT_PAGE_BOUNDARY = 1;

export const BREAKPOINTS_INDEX: { [key in WebflowBreakpoint]: number } = {
  main: 0,
  medium: 1,
  small: 2,
  tiny: 3,
} as const;
