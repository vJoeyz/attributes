import { type AttributeElements, type AttributeSettings, TOC_ATTRIBUTE } from '@finsweet/attributes-utils';

export const ELEMENTS = [
  /**
   * Defines the contents to use as the table source.
   */
  'contents',

  /**
   * OPTIONAL. Defines the wrapper element that will hold all the TOC links.
   * If not defined, the library will use the immediate parent of the link template elements.
   */
  'table',

  /**
   * Defines a link template element.
   * If the attribute is set to a non-link element, the library will look up for the first parent element that is a link.
   */
  'link',

  /**
   * Defines an interaction trigger.
   * This attribute must be added to a hidden div and place it inside the correspondent link wrapper.
   * When the link is active, it will trigger the "First Click" interaction. When the link is unactive, it will trigger the "Second Click" interaction.
   */
  'ix-trigger',
] as const satisfies AttributeElements;

export const SETTINGS = {
  /**
   * Defines a [scroll-margin-top](https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-margin-top) value for the headers.
   */
  offsettop: { key: 'offsettop' },

  /**
   * Defines a [scroll-margin-bottom](https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-margin-bottom) value for the headers.
   */
  offsetbottom: { key: 'offsetbottom' },

  /**
   * Defines if the links hash should be removed from the URL.
   */
  hideurlhash: { key: 'hideurlhash', values: ['true'] },
} as const satisfies AttributeSettings;

export const DEFAULT_INITIAL_HEADING_LEVEL = 2;
export const ANCHOR_SELECTOR = `fs-${TOC_ATTRIBUTE}-anchor`;

const ALLOWED_HEADINGS_REGEX = '[2-6]';
export const ALLOWED_HEADINGS_SELECTOR = 'h2, h3, h4, h5, h6';

export const OMIT_HEADING_REGEXP = new RegExp(`^\\[fs-${TOC_ATTRIBUTE}-omit\\]`, 'i');
export const CUSTOM_HEADING_REGEXP = new RegExp(`^\\[fs-${TOC_ATTRIBUTE}-h${ALLOWED_HEADINGS_REGEX}\\]`, 'i');
export const HEADING_LEVEL_REGEXP = new RegExp(ALLOWED_HEADINGS_REGEX);
export const ZERO_WIDTH_CHARS_REGEXP = /[\u200B-\u200D\uFEFF]/g;
