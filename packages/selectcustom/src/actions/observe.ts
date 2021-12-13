import debounce from 'just-debounce';
import { ARIA_EXPANDED_KEY } from '$utils/a11ty';
import { populateOptions } from './populate';
import { toggleResetVisibility } from './state';

import type { Settings } from '../utils/types';

/**
 * Observes when the dropdown list is opened/closed.
 * @param settings The instance {@link Settings}.
 */
const observeDropdownList = (settings: Settings) => {
  const { dropdownToggle, dropdownList, optionsStore, hideInitial } = settings;

  const callback: MutationCallback = debounce(() => {
    const selectedOption = optionsStore.find(({ selected }) => selected);
    if (!selectedOption) return;

    const isOpen = dropdownToggle.getAttribute(ARIA_EXPANDED_KEY) === 'true';

    if (isOpen) {
      selectedOption.element.focus();
      return;
    }

    if (hideInitial) window.requestAnimationFrame(() => toggleResetVisibility(!!selectedOption.value, settings));
  }, 20);

  const observer = new MutationObserver(callback);

  observer.observe(dropdownList, {
    attributes: true,
    attributeFilter: ['class', 'style'],
  });
};

/**
 * Observes changes in the {@link HTMLSelectElement} options.
 * @param settings The instance {@link Settings}.
 */
const observeSelectElement = (settings: Settings) => {
  const { selectElement } = settings;

  const observer = new MutationObserver((mutations) => {
    const hasMutatedOptions = mutations.some(({ addedNodes, removedNodes }) =>
      [...addedNodes, ...removedNodes].some((node) => node instanceof HTMLOptionElement)
    );

    if (hasMutatedOptions) populateOptions(settings);
  });

  observer.observe(selectElement, {
    childList: true,
  });
};

/**
 * Observes mutations on elements of the instance.
 * @param settings The instance {@link Settings}.
 */
export const observeElements = (settings: Settings) => {
  observeDropdownList(settings);
  observeSelectElement(settings);
};
