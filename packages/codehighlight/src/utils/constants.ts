import { type AttributeElements, type AttributeSettings } from '@finsweet/attributes-utils';

import { dependencies } from '../../package.json';

export const ELEMENTS = [
  /**
   * Defines a `<code>` element that holds the code to be highlighted.
   */
  'code',
] as const satisfies AttributeElements;

export const SETTINGS = {
  /**
   * Defines the highlighting theme.
   */
  theme: {
    key: 'theme',
  },
} as const satisfies AttributeSettings;

export const HIGHLIGHTJS_VERISON = dependencies['highlight.js'].replace('^', '');

export const HIGHLIGHTJS_THEME_URL = (theme: string) =>
  `//cdn.jsdelivr.net/gh/highlightjs/cdn-release@${HIGHLIGHTJS_VERISON}/build/styles/${theme}.min.css`;
