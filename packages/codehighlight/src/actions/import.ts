import { HIGHLIGHTJS_CUSTOM_THEMES, HIGHLIGHTJS_SCRIPT_URL, HIGHLIGHTJS_THEME_URL } from '../utils/constants';

let hljsImport: Promise<unknown>;
let hljsThemeImport: Promise<unknown>;

/**
 * Dynamically imports highlightJS.
 * @returns An awaitable {@link Promise}.
 */
export const importHighlightJS = async () => {
  if (hljsImport) return hljsImport;

  const script = document.createElement('script');
  script.setAttribute('src', HIGHLIGHTJS_SCRIPT_URL);

  const loadPromise = new Promise((resolve) => {
    script.onload = () => resolve(undefined);
  });

  hljsImport = loadPromise;

  document.head.append(script);

  return loadPromise;
};

/**
 * Dynamically imports a highlightJS theme.
 * @param theme The theme name.
 * @returns An awaitable {@link Promise}.
 */
export const importHighlightJSTheme = async (theme: string | null) => {
  if (hljsThemeImport) return hljsThemeImport;
  if (!theme) return;

  const themeURL = HIGHLIGHTJS_CUSTOM_THEMES[theme] || HIGHLIGHTJS_THEME_URL(theme);

  const link = document.createElement('link');
  link.setAttribute('rel', 'stylesheet');
  link.setAttribute('href', themeURL);

  const loadPromise = new Promise((resolve) => {
    link.onload = () => resolve(undefined);
  });

  hljsThemeImport = loadPromise;

  document.head.append(link);

  return loadPromise;
};
