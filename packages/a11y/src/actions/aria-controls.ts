import { isVisible } from '@finsweet/ts-utils';
import { ARIA_CONTROLS, ARIA_EXPANDED_KEY } from 'global/constants/a11ty';
import debounce from 'just-debounce';

import { queryElement } from '../utils/constants';

/**
 * Observes [aria-controls] target visibility.
 * Sets the correspondent [aria-expanded] attribute value.
 *
 * @returns A callback to disconnect all observers.
 */
export const observeAriaControls = () => {
  const controllers = [...document.querySelectorAll(`[${ARIA_CONTROLS}]`)];

  const observers = controllers.map(observeTarget);

  return () => {
    for (const observer of observers) {
      observer?.disconnect();
    }
  };
};

/**
 * Observes an [aria-controls] target.
 * Sets the correspondent [aria-expanded] attribute value.
 *
 * @param controller The [aria-controls] controller element.
 */
const observeTarget = (controller: Element) => {
  const targetSelector = controller.getAttribute(ARIA_CONTROLS);
  if (!targetSelector) return;

  const target = document.getElementById(targetSelector);
  if (!target) {
    controller.removeAttribute(ARIA_CONTROLS);
    return;
  }

  const autoFocusTarget = queryElement<HTMLElement>('autoFocus', { operator: 'prefixed', scope: target });

  let visibilityState = isVisible(target);

  setAriaExpanded(controller, visibilityState);

  const observerCallback: MutationCallback = () => {
    const newVisibilityState = isVisible(target);

    setAriaExpanded(controller, newVisibilityState);

    if (autoFocusTarget && !visibilityState && newVisibilityState) autoFocusTarget.focus();

    visibilityState = newVisibilityState;
  };

  const debouncedObserverCallback = debounce(observerCallback, 100);

  const observer = new MutationObserver(debouncedObserverCallback);

  observer.observe(target, {
    attributes: true,
    attributeFilter: ['style', 'class'],
  });

  return observer;
};

/**
 * Sets the [aria-expanded] attribute value to a controller.
 * @param controller
 * @param expanded
 */
const setAriaExpanded = (controller: Element, expanded: boolean) => {
  controller.setAttribute(ARIA_EXPANDED_KEY, String(expanded));
};
