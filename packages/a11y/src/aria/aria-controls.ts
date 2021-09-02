import { isVisible } from '@finsweet/ts-utils';
import debounce from 'just-debounce';

/**
 * Observes [aria-controls] target visibility.
 * Sets the correspondent [aria-expanded] attribute value.
 */
export const observeAriaControls = (): void => {
  const controllers = document.querySelectorAll('[aria-controls]');

  for (const controller of controllers) observeTarget(controller);
};

const observeTarget = (controller: Element) => {
  let visible = false;

  const targetSelector = controller.getAttribute('aria-controls');
  const autoFocusTargetSelector = controller.getAttribute('fs-a11y-autofocus');
  if (!targetSelector) return;

  const target = document.getElementById(targetSelector);
  const autoFocusTarget = autoFocusTargetSelector ? document.querySelector(autoFocusTargetSelector) : null;

  if (!target) {
    controller.removeAttribute('aria-controls');
    return;
  }

  const observerCallback: MutationCallback = (mutations) => {
    mutations.forEach(() => {
      const newVisibilityState = isVisible(target);

      controller.setAttribute('aria-expanded', `${newVisibilityState}`);

      if (autoFocusTarget instanceof HTMLElement && !visible && newVisibilityState) autoFocusTarget.focus();

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
