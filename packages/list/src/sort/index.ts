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
    debounce(({ field, direction }: Sorting) => {
      list.triggerHook('sort', { scrollToAnchor: true });

      // Handle query params
      if (list.showQuery) {
        list.setSearchParam('field', field);
        list.setSearchParam('direction', direction);
      }
    }, 0),
    { deep: true, immediate: true }
  );

  // Read query params
  Promise.all([list.getSearchParam('field'), list.getSearchParam('direction')]).then(([field, direction]) => {
    if (field && direction) {
      Object.assign(list.sorting, { field, direction });
    }
  });

  return () => {
    modeCleanup?.();
    hookCleanup();
    sortingCleanup();
  };
};
