import { ATTRIBUTE, getSelector } from './constants';
import { populateSelectElement } from './populate';

/**
 * Inits the attribute.
 *
 */
export const init = (): NodeListOf<Element> => {
  const targetElements = document.querySelectorAll(getSelector('element', 'select', { operator: 'prefixed' }));

  for (const targetElement of targetElements) {
    if (targetElement instanceof HTMLSelectElement) populateSelectElement(targetElement);
  }

  window.fsAttributes[ATTRIBUTE].resolve?.(targetElements);

  return targetElements;
};
