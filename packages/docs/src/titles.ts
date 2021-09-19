import { ATTRIBUTES } from './constants';

// Constants destructuring
const {
  element: { key: elementKey, values: elementValues },
} = ATTRIBUTES;

/**
 * Updates the text content of some elements on the page with the current Attribute's title.
 */
export const initTitles = (): void => {
  const title = document.querySelector(`[${elementKey}="${elementValues.title}"]`);
  const titleTargets = document.querySelectorAll(`[${elementKey}="${elementValues.titleTarget}"]`);

  if (!title || !titleTargets.length) return;

  for (const titleTarget of titleTargets) titleTarget.textContent = title.textContent;
};
