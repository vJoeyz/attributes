import { ATTRIBUTES } from './constants';

// Constants  destructuring
const {
  element: { key: elementKey, values: elementValues },
  src: { key: srcKey },
} = ATTRIBUTES;

// Types
interface Params {
  linkHref: string;
}

/**
 * Inits setting a custom favicon to the current page.
 * Auto init:
 * @param params.currentScript The current `<script>` element.
 *
 * Programatic init:
 * @param params.linkHref Defines the URL source of the image to be set as the favicon.
 */
export function init({ params }: { params: Params }): void;
export function init({ currentScript }: { currentScript: HTMLOrSVGScriptElement | null }): void;
export function init({
  currentScript,
  params,
}: {
  currentScript?: HTMLOrSVGScriptElement | null;
  params?: Params;
}): void {
  let linkHref: string | null | undefined;

  // Get the params
  if (currentScript) linkHref = currentScript.getAttribute(srcKey);
  else if (params) linkHref = params.linkHref;

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
}
