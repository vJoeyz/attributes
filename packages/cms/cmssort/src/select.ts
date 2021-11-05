import { sortListItems } from './sort';

import type { CMSItem, CMSList } from '$cms/cmscore/src';

/**
 * Inits sorting on an `HTMLSelectElement`.
 * @param selectElement The {@link HTMLSelectElement}.
 * @param listInstance The {@link CMSList} instance.
 * @param originalItemsOrder The stored original order of the items.
 */
export const initHTMLSelect = (
  selectElement: HTMLSelectElement,
  listInstance: CMSList,
  originalItemsOrder: CMSItem[]
) => {
  // Prevent submit events on the form
  const form = selectElement.closest('form');
  form?.addEventListener('submit', handleFormSubmit);

  let sortKey: string;
  let direction: 'asc' | 'desc';

  /**
   * Sorts the items based on the current selected `sortKey` and `direction`.
   * @param addingItems Defines if new items are being added.
   * In that case, the rendering responsibilities are handled by another controller.
   */
  const sortItems = async (addingItems?: boolean) => {
    await sortListItems(listInstance, { originalItemsOrder, direction, sortKey, addingItems });
  };

  // Store the original CMS Order
  selectElement.addEventListener('change', async () => {
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

    direction = value.endsWith('-desc') ? 'desc' : 'asc';

    await sortItems();
  });

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
