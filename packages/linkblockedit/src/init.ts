import { ATTRIBUTES } from './constants';

interface Params {
  selector?: string;
}

// Constants  destructuring
const {
  element: { key: elementKey, values: elementValues },
  selector: { key: selectorKey },
} = ATTRIBUTES;

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
    globalSelector = params.getAttribute(selectorKey);
  } else if (params) {
    globalSelector = params.selector;
  }

  const elements = document.querySelectorAll<HTMLElement>(
    `[${elementKey}="${elementValues.parent}"]${globalSelector ? `, ${globalSelector}` : ''}`
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
    if (!(e.target instanceof HTMLElement) || e.target instanceof HTMLAnchorElement) return;

    const target = e.target.closest(`[${elementKey}="${elementValues.parent}"]`);
    if (!target) return;

    e.preventDefault();

    const anchorElement = target.querySelector<HTMLAnchorElement>('a');
    if (anchorElement) anchorElement.click();

    return false;
  });
};
