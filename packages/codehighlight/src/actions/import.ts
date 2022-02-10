import { HIGHLIGHTJS_VERISON } from '../utils/constants';

let hljsImport: Promise<unknown>;

/**
 * Dynamically imports highlightJS.
 * @param theme The theme name.
 * @returns An awaitable {@link Promise}.
 */
export const importHighlightJS = async (theme: string | null) => {
  if (hljsImport) return hljsImport;

  const script = document.createElement('script');
  script.setAttribute(
    'src',
    `//cdn.jsdelivr.net/gh/highlightjs/cdn-release@${HIGHLIGHTJS_VERISON}/build/highlight.min.js`
  );

  let link: HTMLLinkElement | undefined;

  if (theme) {
    link = document.createElement('link');

    link.setAttribute('rel', 'stylesheet');
    link.setAttribute(
      'href',
      `//cdn.jsdelivr.net/gh/highlightjs/cdn-release@${HIGHLIGHTJS_VERISON}/build/styles/${theme}.min.css`
    );
  }

  const loadPromise = new Promise((resolve) => {
    let linkLoaded = !link;
    let scriptLoaded = false;

    const checkFulfill = () => {
      if (linkLoaded && scriptLoaded) resolve(undefined);
    };

    script.onload = () => {
      scriptLoaded = true;
      checkFulfill();
    };

    if (link) {
      link.onload = () => {
        linkLoaded = true;
        checkFulfill();
      };
    }
  });

  hljsImport = loadPromise;

  document.head.append(script);
  if (link) document.head.append(link);

  return loadPromise;
};
