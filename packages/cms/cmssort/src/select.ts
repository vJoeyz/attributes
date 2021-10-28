import { sortListItems } from './sort';

import type { CMSItem, CMSList } from 'packages/cms/cmscore/src';

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
   * @param renderItems If set to `true`, the items of the list are re-rendered.
   */
  const sortItems = async (renderItems?: boolean) => {
    await sortListItems(listInstance, { originalItemsOrder, direction, sortKey, renderItems });
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

    await sortItems(true);
  });

  return sortItems;
};

const handleFormSubmit = (e: Event) => {
  e.preventDefault();
  e.stopImmediatePropagation();
  return false;
};
