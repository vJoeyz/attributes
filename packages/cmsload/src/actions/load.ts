import type { CMSList } from '@finsweet/attributes-cmscore';
import { fetchPageDocument } from '@finsweet/attributes-utils';

import { readPaginationCount } from './pagination';
import { parseLoadedPage } from './parse';

/**
 * Loads all paginated items of a `CMSList` instance.
 * @param listInstance The {@link CMSList} instance.
 *
 * @returns Nothing, it mutates the `CMSList` instance.
 */
export const loadPaginatedItems = async (listInstance: CMSList): Promise<void> => {
  const { paginationNext, paginationPrevious, paginationCount, extractingPaginationData, cacheItems } = listInstance;

  if (!paginationNext && !paginationPrevious) return;

  await extractingPaginationData;

  const totalPages = paginationCount ? readPaginationCount(paginationCount) : undefined;

  await listInstance.displayElement('loader');

  if (totalPages) await parallelItemsLoad(listInstance, totalPages, cacheItems);
  else await chainedPagesLoad(listInstance, cacheItems);

  await listInstance.emit('finishload');

  await listInstance.displayElement('loader', false);
};

/**
 * Collects Collection Items from a Collection List's pagination.
 * Loads all pages in a chained sequence until there are no more valid pages to load.
 *
 * @param listInstance The CMSList instance.
 * @param cache Whether to cache the loaded items or not.
 *
 * @returns Nothing, it mutates the `CMSList` instance.
 */
const chainedPagesLoad = async (listInstance: CMSList, cache: boolean): Promise<void> => {
  const { paginationNext, currentPage } = listInstance;

  if (currentPage) await parallelItemsLoad(listInstance, currentPage, cache);

  if (!paginationNext) return;

  const { href } = paginationNext;
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
    const nextPageURL = await parseLoadedPage(page, listInstance);

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
 * @param listInstance The CMSList instance.
 * @param totalPages The total number of pages to load.
 * @param cache Whether to cache the loaded items or not.
 *
 * @returns Nothing, it mutates the `CMSList` instance.
 */
const parallelItemsLoad = async (listInstance: CMSList, totalPages: number, cache: boolean) => {
  const { paginationNext, paginationPrevious } = listInstance;

  if (!paginationNext && !paginationPrevious) return;

  const { pagesQuery, currentPage } = listInstance;
  if (!pagesQuery || !currentPage) return;

  const { origin, pathname } = window.location;

  // Previous Pages
  for (let pageNumber = currentPage - 1; pageNumber >= 1; pageNumber--) {
    const page = await fetchPageDocument(`${origin}${pathname}?${pagesQuery}=${pageNumber}`, { cache });
    if (!page) return;

    await parseLoadedPage(page, listInstance, 'unshift');
  }

  // Next Pages
  const fetchPromises: Promise<void>[] = [];

  for (let pageNumber = currentPage + 1; pageNumber <= totalPages; pageNumber++) {
    fetchPromises[pageNumber] = (async () => {
      const previousPromise = fetchPromises[pageNumber - 1];

      const page = await fetchPageDocument(`${origin}${pathname}?${pagesQuery}=${pageNumber}`, { cache });

      await previousPromise;

      if (!page) return;

      await parseLoadedPage(page, listInstance);
    })();
  }

  await Promise.all(fetchPromises);
};
