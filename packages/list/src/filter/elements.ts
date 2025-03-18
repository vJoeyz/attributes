import { effect } from '@vue/reactivity';
import type { List } from '../components';

/**
 * Handles the filter-specific elements like the list element, empty element, and results count element.
 * @param list
 * @returns A cleanup function.
 */
export const handleFilterElements = (list: List) => {
  const elementsCleanup = effect(() => {
    const filteredItems = list.hooks.filter.result.value;
    const hasItems = !!filteredItems.length;

    if (list.listElement) {
      list.listElement.style.display = hasItems ? '' : 'none';
    }

    if (list.emptyElement.value) {
      list.emptyElement.value.style.display = hasItems ? 'none' : '';
    }

    if (list.resultsCountElement) {
      list.resultsCountElement.textContent = `${filteredItems.length}`;
    }
  });

  return elementsCleanup;
};
