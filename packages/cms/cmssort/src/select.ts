import { normalizePropKey } from '$cms/utils/props';
import { sortListItems } from './sort';

import type { CMSItem, CMSList } from '$cms/cmscore/src';
import type { SortingDirection, SortItemsCallback } from './types';

/**
 * Inits sorting on an `HTMLSelectElement`.
 * @param selectElement The {@link HTMLSelectElement}.
 * @param listInstance The {@link CMSList} instance.
 * @param originalItemsOrder The stored original order of the items.
 */
export const initHTMLSelect = async (
  selectElement: HTMLSelectElement,
  listInstance: CMSList,
  originalItemsOrder: CMSItem[]
) => {
  // Prevent submit events on the form
  const form = selectElement.closest('form');
  form?.addEventListener('submit', handleFormSubmit);

  let sorting = false;
  let sortKey = selectElement.value;
  let direction: SortingDirection;

  /**
   * Sorts the items based on the current selected `sortKey` and `direction`.
   * @param addingItems Defines if new items are being added.
   * In that case, the rendering responsibilities are handled by another controller.
   */
  const sortItems: SortItemsCallback = async (addingItems) => {
    await sortListItems(listInstance, { originalItemsOrder, direction, sortKey, addingItems });
  };

  // Store the original CMS Order
  selectElement.addEventListener('change', async () => {
    if (sorting) return;

    sorting = true;

    const { value } = selectElement;

    if (value.endsWith('-asc')) {
      direction = 'asc';
      sortKey = value.slice(0, -4);
    } else if (value.endsWith('-desc')) {
      direction = 'desc';
      sortKey = value.slice(0, -5);
    } else {
      direction = 'asc';
      sortKey = value;
    }

    sortKey = normalizePropKey(sortKey);

    await sortItems();

    sorting = false;
  });

  // Sort items if a sortKey exists on page load
  if (sortKey) await sortItems();

  return sortItems;
};

/**
 * Handles `submit` events on the parent form of the `HTMLSelect` element.
 * @param e The `submit` event.
 */
const handleFormSubmit = (e: Event) => {
  e.preventDefault();
  e.stopImmediatePropagation();
  return false;
};
