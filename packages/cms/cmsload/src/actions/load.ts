import type { PaginationButtonElement } from '@finsweet/ts-utils';

import type { CMSList } from '$cms/cmscore/src';
import { fetchPageDocument } from '$cms/utils/fetch';
import { extractPaginationQuery } from '$cms/utils/pagination';
import { checkCMSCoreVersion } from '$cms/utils/versioning';

import { readPaginationCount } from './pagination';
import { parseLoadedPage } from './parse';

/**
 * Loads all paginated items of a `CMSList` instance.
 * @param listInstance The {@link CMSList} instance.
 *
 * @returns Nothing, it mutates the `CMSList` instance.
 */
export const loadPaginatedItems = async (listInstance: CMSList): Promise<void> => {
  const { paginationNext, paginationPrevious, paginationCount, extractingPaginationData } = listInstance;

  if (!paginationNext && !paginationPrevious) return;

  await extractingPaginationData;

  const totalPages = paginationCount ? readPaginationCount(paginationCount) : undefined;

  await listInstance.displayElement('loader');

  if (totalPages) await parallelItemsLoad(listInstance, totalPages);
  else await chainedPagesLoad(listInstance);

  await listInstance.emit('finishload');

  await listInstance.displayElement('loader', false);
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
  const { paginationNext, currentPage } = listInstance;

  if (currentPage && checkCMSCoreVersion('>=', '1.5.0')) await parallelItemsLoad(listInstance, currentPage);

  if (!paginationNext) return;

  const { href } = paginationNext;
  const pageLinks: string[] = [href];

  /**
   * Loads the items from the specified URL.
   * @param href The URL to load.
   */
  const loadPage = async (href: string) => {
    try {
      // Fetch the page
      const page = await fetchPageDocument(href);

      // Check for recursion (action: `all`)
      const nextPageURL = await parseLoadedPage(page, listInstance);

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
  const { paginationNext, paginationPrevious } = listInstance;

  if (!paginationNext && !paginationPrevious) return;

  let pagesQuery: string | undefined;
  let currentPage: number | undefined;

  // TODO: Remove this check after `cmscore 1.5.0` has rolled out.
  if (checkCMSCoreVersion('>=', '1.5.0')) ({ pagesQuery, currentPage } = listInstance);
  else {
    const paginationQuery = extractPaginationQuery((paginationNext || paginationPrevious) as PaginationButtonElement);
    if (!paginationQuery) return;

    [pagesQuery] = paginationQuery;
    currentPage = paginationNext ? paginationQuery[1] - 1 : paginationQuery[1] + 1;
  }

  if (!pagesQuery || !currentPage) return;

  const { origin, pathname } = window.location;

  // Previous Pages
  for (let pageNumber = currentPage - 1; pageNumber >= 1; pageNumber--) {
    try {
      const page = await fetchPageDocument(`${origin}${pathname}?${pagesQuery}=${pageNumber}`);

      await parseLoadedPage(page, listInstance, 'unshift');
    } catch (error) {
      return;
    }
  }

  // Next Pages
  const fetchPromises: Promise<void>[] = [];

  for (let pageNumber = currentPage + 1; pageNumber <= totalPages; pageNumber++) {
    fetchPromises[pageNumber] = (async () => {
      const previousPromise = fetchPromises[pageNumber - 1];

      try {
        const page = await fetchPageDocument(`${origin}${pathname}?${pagesQuery}=${pageNumber}`);

        await previousPromise;

        await parseLoadedPage(page, listInstance);
      } catch (error) {
        await previousPromise;
        return;
      }
    })();
  }

  await Promise.all(fetchPromises);
};
