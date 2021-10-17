import { generateDynamicAttibuteValue, generateSelectors } from '$utils/attributes';

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
       * All items will be loaded at once.
       * Limit can be set with {@link ATTRIBUTES.limit}.
       */
      loadAll: 'load-all',

      /**
       * Items will be loaded when the user reaches the bottom of the Collection List.
       * Threshold can be defined with {@link ATTRIBUTES.threshold}.
       */
      infinite: 'infinite',
    },
  },

  /**
   * Defines the scrolling threshold to trigger a new page load in `infinite` mode.
   */
  threshold: { key: `${ATTRIBUTES_PREFIX}-threshold` },

  /**
   * Defines the animation to use when appending elements to the list.
   * Allowed values are defined in {@link "packages/cms/animations/ANIMATIONS"}.
   */
  animation: { key: `${ATTRIBUTES_PREFIX}-animation` },

  /**
   * Defines the easing function of the animation.
   * Allowed values are defined in {@link "packages/cms/animations/EASINGS"}.
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

  /**
   * Defines a global selector to query lists to instantiate.
   */
  lists: { key: `${ATTRIBUTES_PREFIX}-lists` },
} as const;

export const getSelector = generateSelectors(ATTRIBUTES);

export const DEFAULT_INFINITE_THRESHOLD = '-20';
