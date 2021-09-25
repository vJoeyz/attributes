import { ATTRIBUTES, getSelector } from './constants';

interface Params {
  selector?: string;
}

/**
 * Inits editor friendly link blocks.
 *
 * Auto init:
 * @param params The current `<script>` element.
 *
 * Programatic init:
 * @param params.selector An optional valid CSS selector for querying the elements.
 */
export const init = (params?: HTMLOrSVGScriptElement | Params | null): void => {
  let globalSelector: string | null | undefined;

  if (params instanceof HTMLScriptElement || params instanceof SVGScriptElement) {
    globalSelector = params.getAttribute(ATTRIBUTES.selector.key);
  } else if (params) {
    globalSelector = params.selector;
  }

  const elements = document.querySelectorAll<HTMLElement>(
    `${getSelector('element', 'parent')}${globalSelector ? `, ${globalSelector}` : ''}`
  );

  // Make the elements accessible
  for (const element of elements) {
    const anchorElement = element.querySelector('a');

    if (anchorElement && anchorElement.href) {
      element.setAttribute('role', 'link');
      element.setAttribute('tabindex', '0');

      anchorElement.setAttribute('tabindex', '-1');

      if (anchorElement.textContent) element.setAttribute('aria-label', anchorElement.textContent);
    }
  }

  // Listen events
  window.addEventListener('click', (e) => {
    const { target } = e;

    if (!(target instanceof HTMLElement) || target instanceof HTMLAnchorElement) return;

    const parentElement = target.closest(getSelector('element', 'parent'));
    if (!parentElement) return;

    e.preventDefault();

    const anchorElement = parentElement.querySelector<HTMLAnchorElement>('a');
    if (anchorElement) anchorElement.click();

    return false;
  });
};
