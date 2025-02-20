import { addListener, type FinsweetAttributeInit, isElement, isHTMLElement } from '@finsweet/attributes-utils';

import { getAttribute, getElementSelector, getInstance, queryAllElements } from './utils/selectors';

/**
 * Inits click events mirroring.
 */
export const init: FinsweetAttributeInit = () => {
  const clickCleanup = addListener(window, 'click', ({ target }) => {
    if (!isElement(target)) return;

    const mirrorTrigger = target.closest(getElementSelector('trigger'));
    if (!mirrorTrigger) return;

    // Get the instance index
    const instance = getInstance(mirrorTrigger);

    const mirrorTargets = queryAllElements('target', { instance });

    for (const mirrorTarget of mirrorTargets) {
      if (!isHTMLElement(mirrorTarget)) continue;

      const delay = getAttribute(mirrorTarget, 'delay') || getAttribute(mirrorTrigger, 'delay');

      if (delay) window.setTimeout(() => mirrorTarget.click(), delay);
      else mirrorTarget.click();
    }
  });

  return {
    destroy() {
      clickCleanup();
    },
  };
};
