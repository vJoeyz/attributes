import type { List } from '../components/List';
import { loadPaginatedItems } from './load';

/**
 * Inits the `Render All` mode.
 * @param list The `CMSList` instance.
 * @param loadingText The text to display while loading.
 */
export const initRenderAllMode = async (list: List) => {
  const { paginationNextElement, paginationPreviousElement, paginationCountElement } = list;

  if (!paginationNextElement) return;

  paginationNextElement.style.display = 'none';

  if (paginationPreviousElement) paginationPreviousElement.style.display = 'none';

  paginationCountElement?.remove();

  await loadPaginatedItems(list);

  list.itemsPerPage.set(list.items.get().length);
};
