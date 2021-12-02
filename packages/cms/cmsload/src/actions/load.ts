import { parseLoadedPage } from './parse';
import { readPaginationCount } from './pagination';

import type { CMSList } from '$cms/cmscore/src';

/**
 * Loads all paginated items of a `CMSList` instance.
 * @param listInstance The {@link CMSList} instance.
 *
 * @returns Nothing, it mutates the `CMSList` instance.
 */
export const loadPaginatedItems = async (listInstance: CMSList): Promise<void> => {
  const { index, paginationNext, paginationCount } = listInstance;

  if (!paginationNext || typeof index !== 'number') return;

  const totalPages = paginationCount ? readPaginationCount(paginationCount) : undefined;

  await listInstance.displayElement('loader');

  if (totalPages) await parallelItemsLoad(listInstance, totalPages);
  else await chainedPagesLoad(listInstance);

  await listInstance.emit('finishload');

  await listInstance.displayElement('loader', false);
};

/**
 * Fetches a page as raw `text/html`.
 * @param href The page URL.
 * @returns A string Promise.
 */
const fetchRawPage = async (href: string) => {
  const response = await fetch(href);
  return response.text();
};

/**
 * Collects Collection Items from a Collection List's pagination.
 * Loads all pages in a chained sequence until there are no more valid pages to load.
 *
 * @param listInstance The CMSList instance.
 *
 * @returns Nothing, it mutates the `CMSList` instance.
 */
const chainedPagesLoad = async (listInstance: CMSList): Promise<void> => {
  const { index, paginationNext } = listInstance;

  if (!paginationNext || typeof index !== 'number') return;

  const { href } = paginationNext;
  const pageLinks: string[] = [href];

  /**
   * Loads the items from the specified URL.
   * @param href The URL to load.
   */
  const loadPage = async (href: string) => {
    try {
      // Fetch the page
      const rawPage = await fetchRawPage(href);

      // Check for recursion (action: `all`)
      const nextPageURL = await parseLoadedPage(rawPage, listInstance);

      if (!nextPageURL || pageLinks.includes(nextPageURL)) return;

      pageLinks.push(nextPageURL);

      await loadPage(nextPageURL);
    } catch (error) {
      return;
    }
  };

  await loadPage(href);
};

/**
 * Collects Collection Items from a Collection List's pagination.
 * Loads all pages in parallel.
 *
 * @param listInstance The CMSList instance.
 *
 * @returns Nothing, it mutates the `CMSList` instance.
 */
const parallelItemsLoad = async (listInstance: CMSList, totalPages: number) => {
  const { paginationNext, index } = listInstance;

  if (!paginationNext || typeof index !== 'number') return;

  const { href } = paginationNext;

  const { origin, pathname, searchParams } = new URL(href);

  const [pageEntry] = [...searchParams.entries()];
  if (!pageEntry) return;

  const [pageQuery, rawNextPageNumber] = pageEntry;

  const nextPageNumber = parseInt(rawNextPageNumber);
  const currentPageNumber = nextPageNumber - 1;

  if (!currentPageNumber) return;

  const fetchPromises: Promise<void>[] = [];

  for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
    fetchPromises[pageNumber] = (async () => {
      const previousPromise = fetchPromises[pageNumber - 1];

      if (pageNumber === currentPageNumber) {
        await previousPromise;
        return;
      }

      try {
        const rawPage = await fetchRawPage(`${origin}${pathname}?${pageQuery}=${pageNumber}`);

        await previousPromise;

        await parseLoadedPage(rawPage, listInstance);
      } catch (error) {
        await previousPromise;
        return;
      }
    })();
  }

  await Promise.all(fetchPromises);
};
