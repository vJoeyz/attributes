import { getSelector } from './constants';

/**
 * Updates the text content of some elements on the page with the current Attribute's title.
 */
export const initTitles = (): void => {
  const title = document.querySelector(getSelector('element', 'title'));
  const titleTargets = document.querySelectorAll(getSelector('element', 'titleTarget'));

  if (!title || !titleTargets.length) return;

  for (const titleTarget of titleTargets) titleTarget.textContent = title.textContent;
};
