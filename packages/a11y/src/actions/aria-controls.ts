import { isVisible } from '@finsweet/ts-utils';
import { ARIA_CONTROLS, ARIA_EXPANDED_KEY } from 'global/constants/a11ty';
import debounce from 'just-debounce';

import { queryElement } from '../utils/constants';

/**
 * Observes [aria-controls] target visibility.
 * Sets the correspondent [aria-expanded] attribute value.
 */
export const observeAriaControls = (): void => {
  const controllers = document.querySelectorAll(`[${ARIA_CONTROLS}]`);

  for (const controller of controllers) observeTarget(controller);
};

/**
 * Observes an [aria-controls] target.
 * Sets the correspondent [aria-expanded] attribute value.
 *
 * @param controller The [aria-controls] controller.
 */
const observeTarget = (controller: Element) => {
  let visible = false;

  const targetSelector = controller.getAttribute(ARIA_CONTROLS);
  if (!targetSelector) return;

  const target = document.getElementById(targetSelector);
  if (!target) {
    controller.removeAttribute(ARIA_CONTROLS);
    return;
  }

  const autoFocusTarget = queryElement<HTMLElement>('autoFocus', { operator: 'prefixed', scope: target });

  const observerCallback: MutationCallback = (mutations) => {
    mutations.forEach(() => {
      const newVisibilityState = isVisible(target);

      controller.setAttribute(ARIA_EXPANDED_KEY, `${newVisibilityState}`);

      if (autoFocusTarget && !visible && newVisibilityState) autoFocusTarget.focus();

      visible = newVisibilityState;
    });
  };

  const debouncedObserverCallback = debounce(observerCallback, 100);

  const observer = new MutationObserver(debouncedObserverCallback);

  observer.observe(target, {
    attributes: true,
    attributeFilter: ['style', 'class'],
  });
};
