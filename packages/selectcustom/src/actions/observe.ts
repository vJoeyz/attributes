import { ARIA_EXPANDED_KEY } from '$utils/a11ty';

import type { Settings } from '../utils/types';
import { populateOptions } from './populate';

/**
 * Observes when the dropdown list is opened/closed.
 * @param settings The instance {@link Settings}.
 */
const observeDropdownList = ({ dropdownToggle, dropdownList, optionsStore }: Settings) => {
  const observer = new MutationObserver(() => {
    const isOpen = dropdownToggle.getAttribute(ARIA_EXPANDED_KEY) === 'true';
    if (!isOpen) return;

    const selectedOption = optionsStore.find(({ selected }) => selected);
    if (!selectedOption) return;

    selectedOption.element.focus();
  });

  observer.observe(dropdownList, {
    attributes: true,
    attributeFilter: ['class'],
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
