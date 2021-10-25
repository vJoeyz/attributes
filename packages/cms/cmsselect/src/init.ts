import { getSelector } from './constants';
import { populateSelectElement } from './populate';

/**
 * Inits the attribute.
 *
 */
export const init = (): void => {
  const targetElements = document.querySelectorAll(getSelector('element', 'target', { operator: 'prefixed' }));

  for (const targetElement of targetElements) {
    if (targetElement instanceof HTMLSelectElement) populateSelectElement(targetElement);
  }
};
