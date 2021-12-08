import { loadPaginatedItems } from '../actions/load';

import type { CMSList } from '$cms/cmscore/src';

/**
 * Inits the `Render All` mode.
 * @param listInstance The `CMSList` instance.
 * @param loadingText The text to display while loading.
 */
export const initRenderAllMode = async (listInstance: CMSList): Promise<void> => {
  const { paginationNext, paginationPrevious, paginationCount } = listInstance;

  if (!paginationNext) return;

  paginationNext.style.display = 'none';

  if (paginationPrevious) paginationPrevious.style.display = 'none';

  paginationCount?.remove();

  await loadPaginatedItems(listInstance);
};
