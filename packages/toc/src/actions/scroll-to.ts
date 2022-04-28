import { ALLOWED_HEADINGS_SELECTOR, getSelector } from '../utils/constants';

/**
 * Scrolls into view the currently active hash anchor in the URL, only if it's part of the table of contents.
 */
export const scrollToAnchor = () => {
  const { hash } = window.location;
  if (!hash) return;

  const id = hash.replace('#', '');
  const heading = document.querySelector<HTMLHeadingElement>(
    `${getSelector('element', 'contents', { operator: 'prefixed' })} :is(${ALLOWED_HEADINGS_SELECTOR})[id="${id}"]`
  );

  if (heading) heading.scrollIntoView({ behavior: 'smooth' });
};
