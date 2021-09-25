import { extractNumberSuffix } from '@finsweet/ts-utils';
import { ATTRIBUTES } from './constants';

// Constants  destructuring
const {
  element: { key: elementKey, values: elementValues },
  delay: { key: delayKey },
} = ATTRIBUTES;

/**
 * Inits click events mirroring.
 */
export const init = (): void => {
  window.addEventListener('click', ({ target }) => {
    if (!(target instanceof Element)) return;

    const mirrorTrigger = target.closest(`[${elementKey}^="${elementValues.trigger}"]`);
    if (!mirrorTrigger) return;

    // Get the instance index
    const elementValue = mirrorTrigger.getAttribute(elementKey);
    const instanceIndex = elementValue ? extractNumberSuffix(elementValue) : undefined;

    const mirrorTargets = document.querySelectorAll(`[${elementKey}="${elementValues.target(instanceIndex)}"]`);

    for (const mirrorTarget of mirrorTargets) {
      if (!(mirrorTarget instanceof HTMLElement)) continue;

      const rawDelay = mirrorTarget.getAttribute(delayKey) || mirrorTrigger.getAttribute(delayKey);
      const delay = rawDelay ? parseInt(rawDelay) : undefined;

      if (delay) window.setTimeout(() => mirrorTarget.click(), delay);
      else mirrorTarget.click();
    }
  });
};
