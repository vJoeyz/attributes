/**
 * Attaches the page styles to a Shadow DOM.
 * @param shadowRoot The root of the Shadow DOM.
 * @param page The page document.
 * @returns A Promise that fulfills when all styles have been 100% loaded (with a 10s max timeout).
 */
export const attachPageStyles = async (shadowRoot: ShadowRoot, page: Document) => {
  const styleTags = [...page.querySelectorAll('style, link[rel="stylesheet"]')];

  return Promise.all(
    styleTags.map(
      (styleTag) =>
        new Promise((resolve) => {
          // Load styles
          styleTag.addEventListener('load', () => resolve(undefined), { once: true });
          shadowRoot.append(styleTag);

          // Max 10s timeout
          window.setTimeout(() => resolve(undefined), 10000);
        })
    )
  );
};
