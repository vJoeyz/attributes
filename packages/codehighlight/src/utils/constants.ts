import { generateSelectors } from '$global/factory/selectors';

export const ATTRIBUTE = 'codehighlight';

const ATTRIBUTES_PREFIX = `fs-${ATTRIBUTE}`;

export const CODE_ELEMENT_KEY = 'code';
export const LANGUAGES_SETTING_KEY = 'languages';
export const THEME_SETTING_KEY = 'theme';

export const ATTRIBUTES = {
  element: {
    key: `${ATTRIBUTES_PREFIX}-element`,
    values: {
      /**
       * Defines a `<code>` element that holds the code to be highlighted.
       */
      code: CODE_ELEMENT_KEY,
    },
  },

  /**
   * Defines the highlighting theme.
   */
  theme: {
    key: `${ATTRIBUTES_PREFIX}-${THEME_SETTING_KEY}`,
  },
} as const;

export const [getSelector, queryElement] = generateSelectors(ATTRIBUTES);

export const HIGHLIGHTJS_VERISON = '11.4.0';
