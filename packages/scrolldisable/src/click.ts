import { disableScrolling, enableScrolling, findFirstScrollableElement, isScrollingDisabled } from './scroll';
import { ATTRIBUTES, getSelector } from './constants';

/**
 * Inits listening for click triggers.
 * @param preserveScrollTargets The targets where scrolling must be preserved.
 */
export const initClickTriggers = (preserveScrollTargets: NodeListOf<Element>): void => {
  window.addEventListener('click', ({ target }) => {
    if (!(target instanceof Element)) return;

    // Get the trigger
    const toggleTrigger = target.closest(getSelector('element', 'toggle'));

    const disableTrigger = toggleTrigger || target.closest(getSelector('element', 'disable'));
    const enableTrigger = toggleTrigger || target.closest(getSelector('element', 'enable'));

    const trigger = disableTrigger || enableTrigger;
    if (!trigger) return;

    // Make sure the media query is valid
    const mediaToMatch = trigger.getAttribute(ATTRIBUTES.matchMedia.key);
    if (mediaToMatch && !window.matchMedia(mediaToMatch).matches) return;

    // Handle action
    if (isScrollingDisabled() && enableTrigger) enableScrolling();
    else if (!isScrollingDisabled() && disableTrigger instanceof HTMLElement) {
      for (const target of new Set([
        ...preserveScrollTargets,
        findFirstScrollableElement(disableTrigger) || disableTrigger,
      ])) {
        disableScrolling(target);
      }
    }
  });
};
