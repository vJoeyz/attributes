import { disableScrolling, enableScrolling, findFirstScrollableElement, isScrollingDisabled } from './scroll';
import { ATTRIBUTES } from './constants';

// Constants destructuring
const {
  element: { key: elementKey, values: elementValues },
  matchMedia: { key: matchMediaKey },
} = ATTRIBUTES;

/**
 * Inits listening for click triggers.
 * @param preserveScrollTargets The targets where scrolling must be preserved.
 */
export const initClickTriggers = (preserveScrollTargets: NodeListOf<Element>): void => {
  window.addEventListener('click', ({ target }) => {
    if (!(target instanceof HTMLElement)) return;

    // Get the trigger
    const toggleTrigger = target.closest(`[${elementKey}="${elementValues.toggle}"]`);

    const disableTrigger = toggleTrigger || target.closest(`[${elementKey}="${elementValues.disable}"]`);
    const enableTrigger = toggleTrigger || target.closest(`[${elementKey}="${elementValues.enable}"]`);

    const trigger = disableTrigger || enableTrigger;
    if (!trigger) return;

    // Make sure the media query is valid
    const mediaToMatch = trigger.getAttribute(matchMediaKey);
    if (mediaToMatch && !window.matchMedia(`(${mediaToMatch})`).matches) return;

    // Handle action
    if (isScrollingDisabled() && enableTrigger) enableScrolling();
    else if (!isScrollingDisabled() && disableTrigger instanceof HTMLElement) {
      for (const target of [...preserveScrollTargets, findFirstScrollableElement(disableTrigger) || disableTrigger]) {
        disableScrolling(target);
      }
    }
  });
};
