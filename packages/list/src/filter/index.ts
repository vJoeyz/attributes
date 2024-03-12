import {
  addListener,
  clearFormField,
  extractCommaSeparatedValues,
  type FormField,
  isFormField,
  parseNumericAttribute,
} from '@finsweet/attributes-utils';

import type { List } from '../components/List';
import { subscribeMultiple } from '../utils/reactivity';
import { getAttribute, getElementSelector } from '../utils/selectors';
import { initAdvancedFilters } from './advanced';
import { getFilterData, getFiltersData } from './data';
import { filterItems } from './filter';
import { initTags } from './tags';

/**
 * Inits loading functionality for the list.
 * @param list
 * @param form
 */
export const initListFiltering = (list: List, form: HTMLFormElement) => {
  // Init hook
  // TODO: Remove hook for cleanup
  list.addHook('filter', (items) => {
    const filters = list.filters.get();

    const filteredItems = filterItems(filters, items);
    return filteredItems;
  });

  // Handle elements
  const elementsCleanup = subscribeMultiple(
    [list.hooks.filter.result, list.emptyElement],
    ([filteredItems, emptyElement]) => {
      const hasItems = !!filteredItems?.length;

      if (list.listElement) {
        list.listElement.style.display = hasItems ? '' : 'none';
      }

      if (emptyElement) {
        emptyElement.style.display = hasItems ? 'none' : '';
      }
    }
  );

  // Get filters data
  const filtersData = getFiltersData(form);
  list.filters.set(filtersData);

  // Trigger the hook when the filters change
  const filtersCleanup = list.filters.subscribe(() => {
    list.triggerHook('filter');
  });

  // TODO - Init tags + cleanup
  initTags(list);

  const advancedFiltersCleanup = initAdvancedFilters(list, form);

  const debounces = new Map<FormField, number>();

  // Handle inputs
  const inputCleanup = addListener(form, 'input', (e) => {
    const { target } = e;

    if (!isFormField(target)) return;

    const rawFieldKey = getAttribute(target, 'field');
    if (!rawFieldKey) return;

    const debounce = debounces.get(target);
    if (debounce) {
      clearTimeout(debounce);
    }

    const rawTimeout = getAttribute(target, 'debounce');

    // With debouncing
    if (rawTimeout) {
      const timeout = rawTimeout ? parseNumericAttribute(rawTimeout, 0) : 0;

      const timeoutId = setTimeout(() => {
        const filterData = getFilterData(target, rawFieldKey);
        const filterKey = `${rawFieldKey}_${filterData.op}`;

        list.filters.setKey(filterKey, filterData);
      }, timeout);

      debounces.set(target, timeoutId);

      return;
    }

    // Without debouncing
    const filterData = getFilterData(target, rawFieldKey);
    const filterKey = `${rawFieldKey}_${filterData.op}`;

    list.filters.setKey(filterKey, filterData);
  });

  // Handle clear buttons
  const clickCleanup = addListener(form, 'click', (e) => {
    const { target } = e;

    if (!(target instanceof Element)) return;

    const clearElement = target?.closest(getElementSelector('clear'));
    if (!clearElement) return;

    const rawFilterKey = getAttribute(clearElement, 'field');
    const fieldsToClear = rawFilterKey ? extractCommaSeparatedValues(rawFilterKey) : undefined;

    for (const element of form.elements) {
      const field = getAttribute(element, 'field');

      if (!field) continue;
      if (!isFormField(element)) continue;
      if (fieldsToClear && !fieldsToClear.includes(field)) continue;

      debounces.delete(element);
      clearFormField(element);
    }
  });

  return () => {
    elementsCleanup();
    filtersCleanup();
    advancedFiltersCleanup?.();
    inputCleanup();
    clickCleanup();
  };
};
