import { getInstanceIndex } from 'global/attributes';
import { isFormField, simulateEvent } from '@finsweet/ts-utils';
import { ATTRIBUTES, getSelector, queryElement } from './constants';

/**
 * Inits click events mirroring.
 */
export const init = (): void => {
  window.addEventListener('input', ({ target }) => {
    if (!(target instanceof Element)) return;

    const mirrorTrigger = target.closest(getSelector('element', 'trigger', { operator: 'prefixed' }));
    if (!isFormField(mirrorTrigger)) return;

    // Get the instance index
    const instanceIndex = getInstanceIndex(mirrorTrigger, ATTRIBUTES.element.key);

    const mirrorTarget = queryElement('target', { instanceIndex });
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
