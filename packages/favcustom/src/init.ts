import { ATTRIBUTES } from './constants';

// Types
interface Params {
  linkHref: string;
}

// Constants  destructuring
const {
  element: { key: elementKey, values: elementValues },
  src: { key: srcKey },
} = ATTRIBUTES;

/**
 * Inits setting a custom favicon to the current page.
 *
 * Auto init:
 * @param params The current `<script>` element.
 *
 * Programatic init:
 * @param params.linkHref Defines the URL source of the image to be set as the favicon.
 */
export const init = (params?: HTMLOrSVGScriptElement | Params | null): void => {
  let linkHref: string | null | undefined;

  // Get the params
  if (params instanceof HTMLScriptElement || params instanceof SVGScriptElement) {
    linkHref = params.getAttribute(srcKey);
  } else if (params) {
    linkHref = params.linkHref;
  }

  // Get the element's src, if existing.
  const srcElement = document.querySelector(`[${elementKey}="${elementValues.src}"]`);
  const elementSrc = srcElement instanceof HTMLImageElement ? srcElement.src : undefined;
  if (elementSrc) linkHref = elementSrc;

  if (!linkHref) return;

  //Build the link element
  const linkElement = document.querySelector<HTMLLinkElement>("link[rel*='icon']") || document.createElement('link');
  linkElement.type = 'image/x-icon';
  linkElement.rel = 'shortcut icon';
  linkElement.href = linkHref;

  // Append the new one
  document.head.appendChild(linkElement);
};
