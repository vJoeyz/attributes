import { DROPDOWN_CSS_CLASSES, type DropdownElement, isHTMLSelectElement } from '@finsweet/attributes-utils';
import { watch } from '@vue/reactivity';
import debounce from 'just-debounce';

import type { List } from '../components/List';
import { initButtons } from './buttons';
import { initDropdown } from './dropdown';
import { initHTMLSelect } from './select';
import { sortListItems } from './sort';
import type { Sorting } from './types';

/**
 * Inits sorting functionality for the list.
 */
export const initListSorting = (list: List, triggers: HTMLElement[]) => {
  // Init mode
  const [firstTrigger] = triggers;
  const isSelect = isHTMLSelectElement(firstTrigger);
  const isDropdown = firstTrigger.closest<DropdownElement>(`.${DROPDOWN_CSS_CLASSES.dropdown}`);

  const modeCleanup = isSelect
    ? initHTMLSelect(firstTrigger, list)
    : isDropdown
    ? initDropdown(isDropdown, list)
    : initButtons(triggers, list);

  // Set up sorting hook
  const hookCleanup = list.addHook('sort', (items) => sortListItems(items, list.sorting));

  // Set up reactivity
  const sortingCleanup = watch(
    list.sorting,
    debounce((sorting: Sorting) => {
      list.triggerHook('sort', { scrollToAnchor: list.hasInteracted.value });

      // Handle query params
      if (list.showQuery) {
        list.setSearchParam('sorting', JSON.stringify(sorting));
      }
    }, 0),
    { deep: true, immediate: true }
  );

  // Read query params
  Promise.all([list.getSearchParam('sorting')]).then(([rawSorting]) => {
    if (!rawSorting) return;

    try {
      const sorting = JSON.parse(rawSorting);
      Object.assign(list.sorting, sorting);
    } catch {}
  });

  return () => {
    modeCleanup?.();
    hookCleanup();
    sortingCleanup();
  };
};
