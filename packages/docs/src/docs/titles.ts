import { getSelector, queryElement } from '../utils/constants';

/**
 * Updates the text content of some elements on the page with the current Attribute's title.
 */
export const initTitles = (): void => {
  const title = queryElement('title');
  const titleTargets = document.querySelectorAll(getSelector('element', 'titleTarget'));

  if (!title || !titleTargets.length) return;

  for (const titleTarget of titleTargets) titleTarget.textContent = title.textContent;
};
