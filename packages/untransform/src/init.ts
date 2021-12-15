import { getFixedElement } from './actions/collect';
import { moveElementToBody } from './actions/move';
import { ATTRIBUTES, getSelector } from './utils/constants';

// State
let restoreUntransformedElement: (() => void) | undefined;

/**
 * Inits untransform handler.
 * The CSS style is injected to the `<head>`.
 * The click events are listened for the triggers.
 */
export const init = (): void => {
  window.addEventListener('click', async ({ target }) => {
    if (!(target instanceof Element)) return;

    // Get the trigger
    const toggleTrigger = target.closest(getSelector('element', 'toggle', { operator: 'prefixed' }));

    const onTrigger =
      !restoreUntransformedElement && toggleTrigger
        ? toggleTrigger
        : target.closest(getSelector('element', 'on', { operator: 'prefixed' }));

    const offTrigger =
      restoreUntransformedElement && toggleTrigger
        ? toggleTrigger
        : target.closest(getSelector('element', 'off', { operator: 'prefixed' }));

    const trigger = onTrigger || offTrigger;

    if (!trigger) return;

    if ((onTrigger && restoreUntransformedElement) || (offTrigger && !restoreUntransformedElement)) return;

    // Get the timeout value
    const timeoutValue = trigger.getAttribute(ATTRIBUTES.timeout.key);
    const timeout = timeoutValue ? parseInt(timeoutValue) : undefined;

    // ON
    if (onTrigger) {
      const fixedElement = getFixedElement(onTrigger);
      if (!fixedElement) return;

      restoreUntransformedElement = moveElementToBody(fixedElement, timeout);

      return;
    }

    // OFF
    if (!restoreUntransformedElement) return;

    window.setTimeout(() => {
      restoreUntransformedElement?.();
      restoreUntransformedElement = undefined;
    }, timeout);
  });
};
