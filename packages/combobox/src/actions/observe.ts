import { isHTMLOptionElement } from '@finsweet/ts-utils';
import debounce from 'just-debounce';

import { ARIA_ACTIVEDESCENDANT_KEY, ARIA_EXPANDED_KEY } from '$global/constants/a11y';

import { toggleDropdownCloseIcon } from '../utils';
import { DROPDOWN_IS_OPEN } from '../utils/constants';
import type { Settings } from '../utils/types';
import { populateOptions } from './populate';

/**
 * Observes when the dropdown list is opened/closed.
 * @param settings The instance {@link Settings}.
 *
 * @returns The MutationObserver.
 */
const observeDropdownList = (settings: Settings) => {
  const { dropdownList, navListElement, optionsStore, selectElement, inputElement, hideInitial } = settings;
  let prevDropdownState = navListElement.classList.contains(DROPDOWN_IS_OPEN);

  const callback: MutationCallback = debounce((mutations: MutationRecord[]) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'class') {
        const currentStateIsOpen = (mutation.target as HTMLDivElement).classList.contains(DROPDOWN_IS_OPEN);
        if (prevDropdownState !== currentStateIsOpen) {
          prevDropdownState = currentStateIsOpen;

          const selectValue = selectElement.value;

          if (!currentStateIsOpen && !selectValue) {
            inputElement.setAttribute(ARIA_ACTIVEDESCENDANT_KEY, '');
          }
          return;
        }

        if (!currentStateIsOpen) {
          inputElement.setAttribute(ARIA_ACTIVEDESCENDANT_KEY, '');
          inputElement.setAttribute(ARIA_EXPANDED_KEY, 'false');
          return;
        }
        inputElement.setAttribute(ARIA_EXPANDED_KEY, 'true');
      }
    });

    const selectedOption = optionsStore.find(({ selected }) => selected);
    const firstNonHiddenOption = optionsStore.find(({ hidden }) => !hidden);

    if (!selectedOption || !firstNonHiddenOption) return;

    if (hideInitial) window.requestAnimationFrame(() => toggleDropdownCloseIcon(settings));
  }, 20);

  const observer = new MutationObserver(callback);

  observer.observe(dropdownList, {
    attributes: true,
    attributeFilter: ['class', 'style'],
  });

  return observer;
};

/**
 * Observes changes in the {@link HTMLSelectElement} options.
 * @param settings The instance {@link Settings}.
 *
 * @returns The MutationObserver.
 */
const observeSelectElement = (settings: Settings) => {
  const { selectElement } = settings;

  const observer = new MutationObserver((mutations) => {
    const hasMutatedOptions = mutations.some(({ addedNodes, removedNodes }) =>
      [...addedNodes, ...removedNodes].some(isHTMLOptionElement)
    );

    if (hasMutatedOptions) populateOptions(settings);
  });

  observer.observe(selectElement, {
    childList: true,
  });

  return observer;
};

/**
 * Observes mutations on elements of the instance.
 * @param settings The instance {@link Settings}.
 *
 * @returns A callback to destroy the MutationObservers.
 */
export const observeElements = (settings: Settings) => {
  const dropdownListObserver = observeDropdownList(settings);
  const selectElementObserver = observeSelectElement(settings);

  return () => {
    dropdownListObserver.disconnect();
    selectElementObserver.disconnect();
  };
};
