import { extractNumberSuffix, getAllParents } from '@finsweet/ts-utils';
import { ATTRIBUTES, UNTRANSFORM_CLASS, UNTRANSFORM_STYLES } from './constants';

// Constants  destructuring
const {
  element: { key: elementKey, values: elementValues },
  timeout: { key: timeoutKey },
} = ATTRIBUTES;

// State
let untransformOn = false;

/**
 * Inits untransform handler.
 * The CSS style is injected to the `<head>`.
 * The click events are listened for the triggers.
 */
export const init = (): void => {
  // Insert the styles
  document.head.insertAdjacentHTML('beforeend', UNTRANSFORM_STYLES);

  window.addEventListener('click', ({ target }) => {
    if (!(target instanceof Element)) return;

    // Get the trigger
    const toggleTrigger = target.closest(`[${elementKey}^="${elementValues.toggle}"]`);

    const onTrigger = toggleTrigger || target.closest(`[${elementKey}^="${elementValues.on}"]`);
    const offTrigger = toggleTrigger || target.closest(`[${elementKey}^="${elementValues.off}"]`);

    const trigger = onTrigger || offTrigger;
    if (!trigger) return;

    // Get the instance index
    const elementValue = trigger.getAttribute(elementKey);
    const instanceIndex = elementValue ? extractNumberSuffix(elementValue) : undefined;

    // Get the fixed element
    const fixedElement = document.querySelector(`[${elementKey}="${elementValues.fixed(instanceIndex)}"]`);

    // Perform actions
    if (!untransformOn && onTrigger) {
      const parents = getAllParents(fixedElement || trigger);

      for (const parent of parents) parent.classList.add(UNTRANSFORM_CLASS);

      untransformOn = true;
      return;
    }

    if (untransformOn && offTrigger) {
      const timeoutValue = trigger.getAttribute(timeoutKey);
      const timeout = timeoutValue ? parseInt(timeoutValue) : undefined;

      window.setTimeout(() => {
        const parents = getAllParents(fixedElement || trigger);

        for (const parent of parents) parent.classList.remove(UNTRANSFORM_CLASS);

        untransformOn = false;
      }, timeout);
    }
  });
};
