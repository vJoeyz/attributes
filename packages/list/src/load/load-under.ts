import { addListener } from '@finsweet/attributes-utils';
import { atom } from 'nanostores';

import type { List } from '../components/List';
import { loadPaginatedItems } from './load';

/**
 * Inits the default mode.
 * @param list The `List` instance.
 *
 * @returns A callback to remove event listeners.
 */
export const initLoadUnderMode = async (list: List) => {
  const { paginationNextElement, paginationPreviousElement, paginationCountElement, itemsPerPage } = list;

  if (!paginationNextElement) return;

  if (paginationPreviousElement) paginationPreviousElement.style.display = 'none';

  paginationCountElement?.remove();

  const itemsToDisplay = atom(itemsPerPage.get());

  list.addHook('paginate', (items) => {
    const paginatedItems = items.slice(0, itemsToDisplay.get());

    paginationNextElement.style.display = paginatedItems.length === items.length ? 'none' : '';

    return paginatedItems;
  });

  // Init
  const clickCleanup = addListener(paginationNextElement, 'click', async (e) => {
    e.preventDefault();

    itemsToDisplay.set(itemsToDisplay.get() + itemsPerPage.get());
    list.triggerHook('paginate');
  });

  await loadPaginatedItems(list);

  // Destroy callback
  return clickCleanup;
};
