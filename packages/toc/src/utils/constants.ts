import { generateDynamicAttibuteValue, generateSelectors } from '$global/factory/selectors';

export const ATTRIBUTE = 'toc';

const ATTRIBUTES_PREFIX = `fs-${ATTRIBUTE}`;

export const CONTENTS_ELEMENT_KEY = 'contents';
export const LINK_ELEMENT_KEY = 'link';
export const IX_TRIGGER_ELEMENT_KEY = 'ix-trigger';

export const OFFSET_TOP_SETTING_KEY = 'offsettop';
export const OFFSET_BOTTOM_SETTING_KEY = 'offsetbottom';
export const HIDE_URL_HASH_SETTING_KEY = 'hideurlhash';
export const HIDE_URL_HASH_SETTING_VALUES = { true: 'true' } as const;

export const ATTRIBUTES = {
  element: {
    key: `${ATTRIBUTES_PREFIX}-element`,
    values: {
      /**
       * Defines the contents to use as the table source.
       */
      contents: generateDynamicAttibuteValue(CONTENTS_ELEMENT_KEY),

      /**
       * Defines a link template element.
       * If the attribute is set to a non-link element, the library will look up for the first parent element that is a link.
       */
      link: generateDynamicAttibuteValue(LINK_ELEMENT_KEY),

      /**
       * Defines a link template element.
       * If the attribute is set to a non-link element, the library will look up for the first parent element that is a link.
       */
      ixTrigger: IX_TRIGGER_ELEMENT_KEY,
    },
  },

  /**
   * Defines a [scroll-margin-top](https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-margin-top) value for the headers.
   */
  scrollMarginTop: {
    key: `${ATTRIBUTES_PREFIX}-${OFFSET_TOP_SETTING_KEY}`,
  },

  /**
   * Defines a [scroll-margin-bottom](https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-margin-bottom) value for the headers.
   */
  scrollMarginBottom: {
    key: `${ATTRIBUTES_PREFIX}-${OFFSET_BOTTOM_SETTING_KEY}`,
  },

  /**
   * Defines if the links hash should be removed from the URL.
   */
  hideURLHash: { key: `${ATTRIBUTES_PREFIX}-${HIDE_URL_HASH_SETTING_KEY}`, values: HIDE_URL_HASH_SETTING_VALUES },
} as const;

export const [getSelector, queryElement] = generateSelectors(ATTRIBUTES);

export const DEFAULT_INITIAL_HEADING_LEVEL = 2;
export const ANCHOR_SELECTOR = `${ATTRIBUTES_PREFIX}-anchor`;

const ALLOWED_HEADINGS_REGEX = '[2-6]';
export const ALLOWED_HEADINGS_SELECTOR = 'h2, h3, h4, h5, h6';

export const OMIT_HEADING_REGEXP = new RegExp(`^\\[${ATTRIBUTES_PREFIX}-omit\\]`, 'i');
export const CUSTOM_HEADING_REGEXP = new RegExp(`^\\[${ATTRIBUTES_PREFIX}-h${ALLOWED_HEADINGS_REGEX}\\]`, 'i');
export const HEADING_LEVEL_REGEXP = new RegExp(ALLOWED_HEADINGS_REGEX);
export const ZERO_WIDTH_CHARS_REGEXP = /[\u200B-\u200D\uFEFF]/g;
