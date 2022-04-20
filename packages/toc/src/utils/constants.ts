import { generateDynamicAttibuteValue, generateSelectors } from '$global/factory/selectors';

import { Heading } from './types';

export const ATTRIBUTE = 'toc';

const ATTRIBUTES_PREFIX = `fs-${ATTRIBUTE}`;

export const CONTENTS_ELEMENT_KEY = 'contents';
export const LINK_ELEMENT_KEY = 'link';
export const IX_TRIGGER_ELEMENT_KEY = 'ix-trigger';

export const HEADINGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;
export const HEADING_SETTING_KEY = 'heading';
export const HEADING_SETTING_VALUES = Object.fromEntries(HEADINGS.map((heading) => [heading, heading])) as {
  [key in Heading]: key;
};

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
   * Defines the heading level of a link. If not defined anywhere, the base level defaults to `h2`.
   */
  heading: {
    key: `${ATTRIBUTES_PREFIX}-${HEADING_SETTING_KEY}`,
    values: HEADING_SETTING_VALUES,
  },
} as const;

export const [getSelector, queryElement] = generateSelectors(ATTRIBUTES);
