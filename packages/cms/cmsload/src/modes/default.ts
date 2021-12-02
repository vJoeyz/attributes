import { loadPaginatedItems } from '../actions/load';
import { incrementItemsPerPage } from '../actions/pagination';

import type { CMSList } from '$cms/cmscore/src';

/**
 * Inits the default mode.
 * @param listInstance The `CMSList` instance.
 */
export const initDefaultMode = async (listInstance: CMSList): Promise<void> => {
  const { paginationNext, paginationPrevious, paginationCount, itemsPerPage: originalItemsPerPage } = listInstance;
  if (!paginationNext) return;

  paginationCount?.remove();
  paginationPrevious?.remove();

  let isLoading = true;
  let isHandling = false;

  listInstance.currentPage = 1;

  listInstance.on('renderitems', () => {
    const { validItems, items, itemsPerPage: currentItemsPerPage } = listInstance;

    if (!isLoading && items.length === currentItemsPerPage) {
      conclude();
      return;
    }

    paginationNext.style.display = validItems.length > currentItemsPerPage ? '' : 'none';
  });

  /**
   * Handles click events on the `Pagination Next` button.
   * @param e The mouse event.
   */
  const handleClicks = async (e: MouseEvent) => {
    e.preventDefault();

    if (isHandling) return;

    isHandling = true;

    await incrementItemsPerPage(listInstance, isLoading, originalItemsPerPage, e);

    isHandling = false;
  };

  /**
   * Destroys the `Pagination Next` button..
   */
  const conclude = () => {
    paginationNext.removeEventListener('click', handleClicks);
    paginationNext.remove();
  };

  // Init
  paginationNext.addEventListener('click', handleClicks);

  await loadPaginatedItems(listInstance);

  isLoading = false;
};
