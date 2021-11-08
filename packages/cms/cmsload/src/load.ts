import { getCollectionElements, getCollectionListWrappers } from '@finsweet/ts-utils';
import { collectMainSettings } from './settings';

import type { PaginationButtonElement } from '@finsweet/ts-utils';
import type { CMSList } from '$cms/cmscore/src';

/**
 * DOM Parser to parse html strings.
 */
const domParser = new DOMParser();

/**
 * Collects Collection Items from a Collection List's pagination.
 * @param listInstance The CMSList instance.
 * @param action The action to perform:`next` just loads the next page's items, `all` loads all of them.
 * @param resetIx Defines if Webflow Interactions should be restarted after finishing loading.
 * @returns The URL of the next page to be loaded.
 */
export const loadListItems = async (listInstance: CMSList, action: 'next' | 'all'): Promise<string | undefined> => {
  const pageLinks: string[] = [];

  const { index, paginationNext } = listInstance;
  if (!paginationNext || typeof index !== 'number') return;

  /**
   * Loads the items from the specified URL.
   * @param nextButton
   */
  const loadPage = async ({ href }: PaginationButtonElement | { href: string }) => {
    // Make sure the limit hasn't reached
    let nextPageURL: string | undefined;

    try {
      // Fetch the page
      const response = await fetch(href);
      const rawPage = await response.text();
      const page = domParser.parseFromString(rawPage, 'text/html');

      // Get DOM Elements
      const collectionListWrapper = getCollectionListWrappers([], page)[index];
      if (!collectionListWrapper) return;

      // Store and mount the Pagination Previous element, if required
      if (!listInstance.paginationPrevious) {
        const paginationPrevious = getCollectionElements(collectionListWrapper, 'previous');

        if (paginationPrevious) listInstance.addPaginationPrevious(paginationPrevious);
      }

      // Store and mount the new items
      const collectionItems = getCollectionElements(collectionListWrapper, 'items');

      await listInstance.addItems(collectionItems);

      // Check for recursion (action: `all`)
      nextPageURL = getCollectionElements(collectionListWrapper, 'next')?.href;

      if (nextPageURL && !pageLinks.includes(nextPageURL) && action === 'all') {
        pageLinks.push(nextPageURL);
        await loadPage({ href: nextPageURL });

        return;
      }

      await listInstance.emit('finishload');
    } catch (error) {
      return;
    }

    return nextPageURL;
  };

  pageLinks.push(paginationNext.href);
  return await loadPage(paginationNext);
};

/**
 * Handles the Pagination Next button when loading a new page's items.
 * @param params
 * @returns The URL of the next page to be loaded.
 */
export const loadNextPage = async ({
  e,
  paginationNext,
  listInstance,
  paginationNextTextNode,
  originalNextText,
  loadingText,
}: {
  e?: MouseEvent;
} & ReturnType<typeof collectMainSettings>): ReturnType<typeof loadListItems> => {
  e?.preventDefault();

  if (!document.body.contains(paginationNext)) return;

  await listInstance.displayElement('loader');

  if (paginationNextTextNode && loadingText) paginationNextTextNode.textContent = loadingText;

  const nextPageURL = await loadListItems(listInstance, 'next');

  if (paginationNextTextNode && originalNextText) paginationNextTextNode.textContent = originalNextText || '';

  if (nextPageURL) paginationNext.href = nextPageURL;
  else paginationNext.remove();

  await listInstance.displayElement('loader', false);

  return nextPageURL;
};
