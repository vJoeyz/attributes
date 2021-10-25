import { sortListItems } from './sort';

import type { CMSList } from 'packages/cms/cmscore/src';

export const initHTMLSelect = (selectElement: HTMLSelectElement, listInstance: CMSList) => {
  // Prevent submit events on the form
  const form = selectElement.closest('form');
  form?.addEventListener('submit', handleFormSubmit);

  // Store the original CMS Order
  const { items } = listInstance;

  const originalItemsOrder = [...items];

  selectElement.addEventListener('change', async () => {
    const { value } = selectElement;

    let sortKey: string;
    let direction: 'asc' | 'desc';

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

    await sortListItems(listInstance, { originalItemsOrder, direction, sortKey });
  });
};

const handleFormSubmit = (e: Event) => {
  e.preventDefault();
  e.stopImmediatePropagation();
  return false;
};
