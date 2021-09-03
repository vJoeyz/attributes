import { extractNumberSuffix, isFormField, simulateEvent } from '@finsweet/ts-utils';
import { ATTRIBUTES } from './constants';

// Constants  destructuring
const {
  element: { key: elementKey, values: elementValues },
} = ATTRIBUTES;

/**
 * Inits click events mirroring.
 */
export const init = (): void => {
  window.addEventListener('input', ({ target }) => {
    if (!(target instanceof Element)) return;

    const mirrorTrigger = target.closest(`[${elementKey}="${elementValues.trigger}"]`);
    if (!isFormField(mirrorTrigger)) return;

    // Get the instance index
    const elementValue = mirrorTrigger.getAttribute(elementKey);
    const instanceIndex = elementValue ? extractNumberSuffix(elementValue) : undefined;

    const mirrorTarget = document.querySelector(`[${elementKey}="${elementValues.target(instanceIndex)}"]`);
    if (!isFormField(mirrorTarget) || mirrorTrigger.type !== mirrorTarget.type) return;

    // If must update the `checked` property
    if (
      mirrorTarget instanceof HTMLInputElement &&
      (mirrorTarget.type === 'checkbox' || mirrorTarget.type === 'radio') &&
      (<HTMLInputElement>mirrorTrigger).checked !== mirrorTarget.checked
    ) {
      mirrorTarget.checked = !mirrorTarget.checked;

      simulateEvent(mirrorTarget, ['input', 'change', 'click']);
      return;
    }

    // If must update the `value` property
    mirrorTarget.value = mirrorTrigger.value;
    simulateEvent(mirrorTarget, ['input', 'change']);
  });
};
