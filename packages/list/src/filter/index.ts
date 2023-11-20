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
  list.addHook('filter', (items) => {
    const filters = list.filters.get();

    const filteredItems = filterItems(filters, items);
    return filteredItems;
  });

  const filtersData = getFiltersData(form);

  list.filters.set(filtersData);

  form.addEventListener('input', (e) => {
    const { target } = e;
    if (!isFormField(target)) return;

    const rawFieldKey = getAttribute(target, 'field');
    if (!rawFieldKey) return;

    const filterData = getFilterData(target);

    list.filters.setKey(rawFieldKey, filterData);
  });

  list.filters.subscribe(() => {
    list.triggerHook('filter');
  });
};
