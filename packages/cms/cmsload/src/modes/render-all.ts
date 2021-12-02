import { loadPaginatedItems } from '../actions/load';

import type { CMSList } from '$cms/cmscore/src';

/**
 * Inits the `Render All` mode.
 * @param listInstance The `CMSList` instance.
 * @param loadingText The text to display while loading.
 */
export const initRenderAllMode = async (listInstance: CMSList): Promise<void> => {
  const { paginationNext, paginationPrevious } = listInstance;
  if (!paginationNext) return;

  paginationPrevious?.remove();

  const handleClicks = (e: MouseEvent) => {
    e.preventDefault();
    return false;
  };

  paginationNext.addEventListener('click', handleClicks);

  await loadPaginatedItems(listInstance);

  paginationNext.removeEventListener('click', handleClicks);
  paginationNext.remove();
};
