import { getElementSelector, getInstanceIndex } from '../utils/selectors';

/**
 * Queries the correspondent fixed element of a specific trigger.
 * @param trigger The trigger element.
 */
export const getLightboxElement = (trigger: Element) => {
  const instanceIndex = getInstanceIndex(trigger);

  const lightboxSelector = getElementSelector('lightbox', { instanceIndex });
  const lightboxElement =
    trigger.parentElement?.querySelector(lightboxSelector) || document.querySelector(lightboxSelector);

  return lightboxElement;
};
