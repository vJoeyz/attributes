import { generateSelectors } from '$utils/attributes';

const ATTRIBUTES_PREFIX = 'fs-scrolldisable';

export const ATTRIBUTES = {
  /**
   * Defines an element that will act as trigger based on its value.
   */
  element: {
    key: `${ATTRIBUTES_PREFIX}-element`,
    values: {
      /**
       * Scrolling will be disabled/enabled when this element becomes visible/hidden.
       */
      whenVisible: 'when-visible',

      /**
       * Scrolling will be enabled when this element is clicked.
       */
      enable: 'enable',

      /**
       * Scrolling will be disabled when this element is clicked.
       */
      disable: 'disable',

      /**
       * Scrolling will be disabled/enabled when this element is clicked.
       */
      toggle: 'toggle',

      /**
       * Specific for `Navbar` components.
       * Scrolling will be disabled/enabled when the `Nav Menu` is open/closed.
       */
      nav: 'smart-nav',

      /**
       * Applied on elements that must preserve scrolling when the page's scrolling is disabled.
       */
      preserve: 'preserve',
    },
  },

  /**
   * Defines the behavior of the scrollbar gap when disabling scrolling.
   */
  scrollbar: {
    key: `${ATTRIBUTES_PREFIX}-scrollbar`,
    values: {
      /**
       * The scrollbar gap will be reserved.
       */
      keep: 'keep',

      /**
       * The scrollbar gap will be removed and all content will be stretched.
       */
      hide: 'hide',
    },
  },

  /**
   * Used to define a media query that restricts when an element acts as a trigger.
   */
  matchMedia: { key: `${ATTRIBUTES_PREFIX}-media` },

  /**
   * Defines if the scrollbar gap must be reserved when disabling scrolling.
   * It's set to the `<script>` tag, `true` by default.
   */
  gap: { key: `${ATTRIBUTES_PREFIX}-gap`, values: { true: 'true', false: 'false' } },
} as const;

export const [getSelector, queryElement] = generateSelectors(ATTRIBUTES);

/**
 * Defines the `Navbar` component media breakpoints.
 */
export const NAV_MEDIAS = {
  medium: '(max-width: 991px)',
  small: '(max-width: 767px)',
  tiny: '(max-width: 479px)',
} as const;
