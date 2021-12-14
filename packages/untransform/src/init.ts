import { getInstanceIndex } from '$global/helpers/instances';
import { getAllParents } from '@finsweet/ts-utils';
import { ATTRIBUTES, getSelector, UNTRANSFORM_CLASS, UNTRANSFORM_STYLES } from './constants';

// Constants destructuring
const {
  element: { key: elementKey },
  timeout: { key: timeoutKey },
} = ATTRIBUTES;

// State
let untransformOn = false;
let currentTimeoutID: number | undefined;

/**
 * Inits untransform handler.
 * The CSS style is injected to the `<head>`.
 * The click events are listened for the triggers.
 */
export const init = (): void => {
  // Insert the styles
  document.head.insertAdjacentHTML('beforeend', UNTRANSFORM_STYLES);

  window.addEventListener('click', async ({ target }) => {
    if (!(target instanceof Element)) return;

    // Get the trigger
    const toggleTrigger = target.closest(getSelector('element', 'toggle', { operator: 'prefixed' }));

    const onTrigger = toggleTrigger || target.closest(getSelector('element', 'on', { operator: 'prefixed' }));
    const offTrigger = toggleTrigger || target.closest(getSelector('element', 'off', { operator: 'prefixed' }));

    const trigger = onTrigger || offTrigger;
    if (!trigger) return;

    // Clear current timeout, if existing
    if (currentTimeoutID) window.clearTimeout(currentTimeoutID);

    // Get the instance index
    const instanceIndex = getInstanceIndex(trigger, elementKey);

    // Get the fixed element
    const { parentElement } = trigger;
    const fixedElementSelector = getSelector('element', 'fixed', { instanceIndex });
    const fixedElement = parentElement
      ? parentElement.querySelector(fixedElementSelector) || parentElement.closest(fixedElementSelector)
      : undefined;

    // Get the timeout value
    const timeoutValue = trigger.getAttribute(timeoutKey);
    const timeout = timeoutValue ? parseInt(timeoutValue) : undefined;

    // Perform actions
    window.setTimeout(() => {
      if (!untransformOn && onTrigger) {
        const parents = getAllParents(fixedElement || trigger);

        for (const parent of parents) parent.classList.add(UNTRANSFORM_CLASS);

        untransformOn = true;
        return;
      }

      if (untransformOn && offTrigger) {
        const parents = getAllParents(fixedElement || trigger);

        for (const parent of parents) parent.classList.remove(UNTRANSFORM_CLASS);

        untransformOn = false;
      }
    }, timeout);
  });
};
