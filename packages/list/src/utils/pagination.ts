import { CMS_CSS_CLASSES, fetchPageDocument, type PaginationButtonElement } from '@finsweet/attributes-utils';

import type { List } from '../components/List';
import { getCollectionElements } from './dom';

const { location, history } = window;

/**
 * Extracts the {@link URLSearchParams} from a list's Pagination Button.
 * @param paginationButton A {@link PaginationButtonElement}.
 *
 * @returns The search params as {@link Object.entries}, if the button is valid.
 */
const getPaginationSearchEntries = (paginationButton?: PaginationButtonElement | null) => {
  if (!paginationButton) return;

  const { href } = paginationButton;

  const { searchParams } = new URL(href);

  const searchEntries = [...searchParams.entries()];

  return searchEntries;
};

/**
 * Extracts the pages query from a `Pagination Next` button.
 *
 * @param paginationNextElement A {@link PaginationButtonElement}.
 *
 * @returns A tuple with [pagesQuery, nextPageNumber].
 */
export const getPaginationQuery = async (list: List) => {
  const paginationNext = list.paginationNextElement.get();
  const paginationPrevious = list.paginationPreviousElement.get();

  const searchEntries = getPaginationSearchEntries(paginationNext || paginationPrevious);
  if (!searchEntries || !searchEntries.length) return;

  let pagesQuery: string | undefined;
  let rawTargetPage: string | undefined;

  if (searchEntries.length === 1) {
    const [pageEntry] = searchEntries;

    if (!pageEntry) return;

    [pagesQuery, rawTargetPage] = pageEntry;
  }

  // If there's more than one `searchParam` we need to fetch the original page to find the correspondent pageQuery.
  else {
    const { origin, pathname } = location;

    const initialPage = await fetchPageDocument(origin + pathname);
    if (!initialPage) return;

    const initialCollectionListWrappers = initialPage.querySelectorAll(`.${CMS_CSS_CLASSES.wrapper}`);

    const initialCollectionListWrapper = initialCollectionListWrappers[list.pageIndex];
    if (!initialCollectionListWrapper) return;

    const initialPaginationNext = getCollectionElements(initialCollectionListWrapper, 'pagination-next');

    const [initialPageEntry] = getPaginationSearchEntries(initialPaginationNext) || [];

    if (!initialPageEntry) return;

    [pagesQuery] = initialPageEntry;

    [, rawTargetPage] = searchEntries.find(([query]) => query === pagesQuery) || [];
  }

  if (!pagesQuery || !rawTargetPage) return;

  const targetPage = parseInt(rawTargetPage);
  const currentPage = paginationNext ? targetPage - 1 : targetPage + 1;

  list.pagesQuery = pagesQuery;
  list.currentPage.set(currentPage);
};

/**
 * Updates the page query parameters.
 * @param listInstance A {@link List} instance.
 */
export const setPaginationQueryParams = ({ currentPage, pagesQuery }: List) => {
  if (!pagesQuery || !currentPage) return;

  const url = new URL(location.href);
  const { searchParams } = url;

  searchParams.set(pagesQuery, `${currentPage}`);

  history.replaceState(null, '', url.toString());
};
