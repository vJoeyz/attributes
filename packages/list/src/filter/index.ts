import { watch } from '@vue/reactivity';
import debounce from 'just-debounce';

import type { List } from '../components/List';
import { queryElement } from '../utils/selectors';
import { initDynamicFilters } from './dynamic';
import { handleFilterElements } from './elements';
import { filterItems } from './filter';
import { initStandardFilters } from './standard';
import { initTags } from './tags';
import type { Filters } from './types';

/**
 * Inits loading functionality for the list.
 * @param list
 * @param form
 */
export const initListFiltering = (list: List, form: HTMLFormElement) => {
  // Init hook
  const hookCleanup = list.addHook('filter', (items) => filterItems(list.filters, items));

  // Handle elements
  const elementsCleanup = handleFilterElements(list);

  // Init filters
  const isDynamic = !!queryElement('condition-group', { scope: form });
  const filteringCleanup = isDynamic ? initDynamicFilters(list, form) : initStandardFilters(list, form);

  // Init Tags
  const tagsCleanup = initTags(list);

  // Trigger the hook when the filters change
  const filtersCleanup = watch(
    list.filters,
    debounce((filters: Filters) => {
      list.triggerHook('filter', { scrollToAnchor: list.hasInteracted.value });

      // Handle query params
      if (list.showQuery) {
        list.setSearchParam('filters', JSON.stringify(filters));
      }
    }, 0),
    { deep: true }
  );

  // Read query params
  list.getSearchParam('filters').then((rawFilters) => {
    if (!rawFilters) return;

    try {
      const filters = JSON.parse(rawFilters);
      Object.assign(list.filters, filters);
    } catch {}
  });

  return () => {
    hookCleanup();
    elementsCleanup();
    tagsCleanup?.();
    filtersCleanup();
    filteringCleanup?.();
  };
};
