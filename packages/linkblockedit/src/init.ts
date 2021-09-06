import { ATTRIBUTE_SELECTOR } from './constants';

/**
 * Inits editor friendly link blocks.
 * @param querySelector An optional valid CSS selector for querying the elements.
 */
export function init(querySelector?: string): void {
  const elements = document.querySelectorAll<HTMLElement>(
    `${querySelector ? `${querySelector}, ` : ''}${ATTRIBUTE_SELECTOR}`
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

    const target = e.target.closest(ATTRIBUTE_SELECTOR);
    if (!target) return;

    e.preventDefault();

    const anchorElement = target.querySelector<HTMLAnchorElement>('a');
    if (anchorElement) anchorElement.click();

    return false;
  });
}
