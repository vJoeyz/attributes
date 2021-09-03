import { extractNumberSuffix } from '@finsweet/ts-utils';
import { ATTRIBUTES } from './constants';

// Constants  destructuring
const {
  element: { key: elementKey, values: elementValues },
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

    const mirrorTarget = document.querySelector(`[${elementKey}="${elementValues.target(instanceIndex)}"]`);

    if (mirrorTarget instanceof HTMLElement) mirrorTarget.click();
  });
};
