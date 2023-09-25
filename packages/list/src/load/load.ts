import { fetchPageDocument, type PageCountElement } from '@finsweet/attributes-utils';

import type { List } from '../components/List';
import { parseLoadedPage } from './parse';

/**
 * Reads the total amount of pages of a CMS List from the `Page Count` element.
 * @param paginationCount A {@link PageCountElement}.
 *
 * @returns The total amount of existing pages.
 */
const readPaginationCount = ({ textContent }: PageCountElement) => {
  if (!textContent) return;

  const [, rawTotalPages] = textContent.split('/');
  if (!rawTotalPages) return;

  const totalPages = parseInt(rawTotalPages.trim());

  return totalPages;
};

/**
 * Loads all paginated items of a `List` instance.
 * @param listInstance The {@link List} instance.
 *
 * @returns Nothing, it mutates the `List` instance.
 */
export const loadPaginatedItems = async (listInstance: List): Promise<void> => {
  const {
    paginationNextElement,
    paginationPreviousElement,
    paginationCountElement,
    loadingPaginationData: extractingPaginationData,
    loaderElement,
    cacheItems,
  } = listInstance;

  if (!paginationNextElement && !paginationPreviousElement) return;

  await extractingPaginationData;

  const totalPages = paginationCountElement ? readPaginationCount(paginationCountElement) : undefined;

  if (loaderElement) {
    loaderElement.style.display = '';
    loaderElement.style.opacity = '1';
  }

  if (totalPages) await parallelItemsLoad(listInstance, totalPages, cacheItems);
  else await chainedPagesLoad(listInstance, cacheItems);

  if (loaderElement) {
    loaderElement.style.display = 'none';
  }
};

/**
 * Collects Collection Items from a Collection List's pagination.
 * Loads all pages in a chained sequence until there are no more valid pages to load.
 *
 * @param list The List instance.
 * @param cache Whether to cache the loaded items or not.
 *
 * @returns Nothing, it mutates the `List` instance.
 */
const chainedPagesLoad = async (list: List, cache: boolean): Promise<void> => {
  const currentPage = list.currentPage.get();
  if (currentPage) {
    await parallelItemsLoad(list, currentPage, cache);
  }

  if (!list.paginationNextElement) return;

  const { href } = list.paginationNextElement;
  const pageLinks: string[] = [href];

  /**
   * Loads the items from the specified URL.
   * @param href The URL to load.
   */
  const loadPage = async (href: string) => {
    // Fetch the page
    const page = await fetchPageDocument(href, { cache });
    if (!page) return;

    // Check for recursion (action: `all`)
    const nextPageURL = await parseLoadedPage(page, list);

    if (!nextPageURL || pageLinks.includes(nextPageURL)) return;

    pageLinks.push(nextPageURL);

    await loadPage(nextPageURL);
  };

  await loadPage(href);
};

/**
 * Collects Collection Items from a Collection List's pagination.
 * Loads all pages in parallel.
 *
 * @param list The List instance.
 * @param totalPages The total number of pages to load.
 * @param cache Whether to cache the loaded items or not.
 *
 * @returns Nothing, it mutates the `List` instance.
 */
const parallelItemsLoad = async (list: List, totalPages: number, cache: boolean) => {
  const { paginationNextElement, paginationPreviousElement } = list;

  if (!paginationNextElement && !paginationPreviousElement) return;

  const { pagesQuery } = list;
  const currentPage = list.currentPage.get();

  if (!pagesQuery || !currentPage) return;

  const { origin, pathname } = window.location;

  // Previous Pages
  for (let pageNumber = currentPage - 1; pageNumber >= 1; pageNumber--) {
    const page = await fetchPageDocument(`${origin}${pathname}?${pagesQuery}=${pageNumber}`, { cache });
    if (!page) return;

    await parseLoadedPage(page, list, 'unshift');
  }

  // Next Pages
  const fetchPromises: Promise<void>[] = [];

  for (let pageNumber = currentPage + 1; pageNumber <= totalPages; pageNumber++) {
    fetchPromises[pageNumber] = (async () => {
      const previousPromise = fetchPromises[pageNumber - 1];

      const page = await fetchPageDocument(`${origin}${pathname}?${pagesQuery}=${pageNumber}`, { cache });

      await previousPromise;

      if (!page) return;

      await parseLoadedPage(page, list);
    })();
  }

  await Promise.all(fetchPromises);
};
