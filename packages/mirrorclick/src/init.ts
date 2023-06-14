import { type FsAttributeInit, parseNumericAttribute } from '@finsweet/attributes-utils';
import { addListener, isElement, isHTMLElement } from '@finsweet/ts-utils';

import { getAttribute, getElementSelector, getInstanceIndex, queryAllElements } from './utils/selectors';

/**
 * Inits click events mirroring.
 */
export const init: FsAttributeInit = () => {
  const clickCleanup = addListener(window, 'click', ({ target }) => {
    if (!isElement(target)) return;

    const mirrorTrigger = target.closest(getElementSelector('trigger'));
    if (!mirrorTrigger) return;

    // Get the instance index
    const instanceIndex = getInstanceIndex(mirrorTrigger);

    const mirrorTargets = queryAllElements('target', { instanceIndex });

    for (const mirrorTarget of mirrorTargets) {
      if (!isHTMLElement(mirrorTarget)) continue;

      const rawDelay = getAttribute(mirrorTarget, 'delay') || getAttribute(mirrorTrigger, 'delay');
      const delay = parseNumericAttribute(rawDelay);

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
