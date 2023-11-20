import { isFormField } from '@finsweet/attributes-utils';

import type { List } from '../components/List';
import { getAttribute } from '../utils/selectors';
import { getFilterData, getFiltersData } from './data';
import { filterItems } from './filter';

/**
 * Inits loading functionality for the list.
 * @param list
 * @param mode
 */
export const initListFiltering = async (list: List, form: HTMLFormElement) => {
  // Init hook
  list.addHook('filter', (items) => {
    const filters = list.filters.get();

    const filteredItems = filterItems(filters, items);
    return filteredItems;
  });

  // Get filters data
  const filtersData = getFiltersData(form);

  list.filters.set(filtersData);

  // Listen for changes
  form.addEventListener('input', (e) => {
    const { target } = e;
    if (!isFormField(target)) return;

    const rawFieldKey = getAttribute(target, 'field');
    if (!rawFieldKey) return;

    const filterData = getFilterData(target);

    list.filters.setKey(rawFieldKey, filterData);
  });

  // Trigger the hook when the filters change
  list.filters.subscribe(() => {
    list.triggerHook('filter');
  });
};
