import { addListener } from '@finsweet/attributes-utils';
import { effect } from '@vue/reactivity';

import type { List } from '../components';
import { getAttribute } from '../utils/selectors';

/**
 * Handles the filter-specific elements like the list element, empty element, and results count element.
 * @param list
 * @returns A cleanup function.
 */
export const handleFilterElements = (list: List) => {
  const elementsCleanup = effect(() => {
    const filteredItems = list.hooks.filter.result.value;
    const hasItems = !!filteredItems.length;
    const hasInteracted = list.filters.groups.some((group) =>
      group.conditions.some((condition) => condition.interacted)
    );

    // Wrapper
    list.wrapperElement.style.display = list.initialElement && !hasInteracted ? 'none' : '';

    // List
    if (list.listElement) {
      list.listElement.style.display = hasItems ? '' : 'none';
    }

    // Empty
    if (list.emptyElement.value) {
      list.emptyElement.value.style.display = hasItems ? 'none' : '';
    }

    // Initial
    if (list.initialElement) {
      list.initialElement.style.display = hasInteracted ? 'none' : '';
    }

    // Results count
    if (list.resultsCountElement) {
      list.resultsCountElement.textContent = `${filteredItems.length}`;
    }
  });

  return elementsCleanup;
};

/**
 * Handles submit events for filters form.
 * @param form
 * @returns A cleanup function.
 */
export const handleFiltersForm = (form: HTMLFormElement) => {
  const allowSubmit = getAttribute(form, 'allowsubmit') === 'true';

  return addListener(form, 'submit', (e) => {
    if (!allowSubmit) {
      e.preventDefault();
      e.stopPropagation();
    }
  });
};
