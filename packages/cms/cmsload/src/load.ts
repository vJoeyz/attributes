import { getCollectionElements } from '@finsweet/ts-utils';
import { ATTRIBUTES, getSelector } from './constants';
import { addItemsToList, getCollectionListWrappers } from 'packages/cms/helpers';

import type { PaginationButtonElement } from '@finsweet/ts-utils';
import type { CMSList } from 'packages/cms/CMSList';

// Constants
const {
  element: { key: elementKey },
  loading: { key: loadingKey },
} = ATTRIBUTES;

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

  const { pageIndex, paginationNext } = listInstance;
  if (!paginationNext || typeof pageIndex !== 'number') return;

  /**
   * Loads the items from the specified URL.
   * @param nextButton
   */
  const loadPage = async ({ href }: PaginationButtonElement | { href: string }) => {
    // Make sure the limit hasn't reached
    let nextPageURL: string | undefined;
    let finishedLoading = false;

    try {
      // Fetch the page
      const response = await fetch(href);
      const rawPage = await response.text();
      const page = domParser.parseFromString(rawPage, 'text/html');

      // Get DOM Elements
      const collectionListWrapper = getCollectionListWrappers([], page)[pageIndex];
      if (!collectionListWrapper) return;

      // Store and mount the new items
      const collectionItems = getCollectionElements(collectionListWrapper, 'items');

      addItemsToList(listInstance, collectionItems).then(async () => {
        if (finishedLoading) await listInstance.emit('finishload');
      });

      // Check for recursion (Mode: "Load All")
      nextPageURL = getCollectionElements(collectionListWrapper, 'next')?.href;

      if (nextPageURL && !pageLinks.includes(nextPageURL) && action === 'all') {
        pageLinks.push(nextPageURL);
        await loadPage({ href: nextPageURL });

        return;
      }

      finishedLoading = true;
    } catch (error) {
      return;
    }

    return nextPageURL;
  };

  pageLinks.push(paginationNext.href);
  return await loadPage(paginationNext);
};

/**
 * Prepares the pagination of a `CMSList` instance:
 * - Gets the pagination buttons.
 * - Gets the user's settings.
 * @param listInstance The `CMSList` instance.
 */
export const preparePagination = (
  listInstance: CMSList
):
  | {
      listInstance: CMSList;
      paginationNext: PaginationButtonElement;
      textNode: Node | null;
      originalText?: string | null;
      loadingText?: string | null;
      loader: HTMLElement | null;
    }
  | undefined => {
  const { paginationNext, paginationPrevious } = listInstance;

  if (!paginationNext) return;
  if (paginationPrevious) paginationPrevious.remove();

  const textNode = paginationNext.querySelector(getSelector('loading'));

  const originalText = textNode?.textContent;

  const loadingText = textNode?.getAttribute(loadingKey);

  const instanceIndex = listInstance.getInstanceIndex(elementKey);

  const loader = document.querySelector<HTMLElement>(getSelector('element', 'loader', { instanceIndex }));
  if (loader) loader.style.display = 'none';

  return { listInstance, paginationNext, textNode, originalText, loadingText, loader };
};

/**
 * Handles the Pagination Next button when loading a new page's items.
 * @param params
 * @returns The URL of the next page to be loaded.
 */
export const handleLoadPage = async ({
  e,
  paginationNext,
  listInstance,
  textNode,
  originalText,
  loadingText,
  loader,
}: {
  e?: MouseEvent;
} & ReturnType<typeof preparePagination>): ReturnType<typeof loadListItems> => {
  e?.preventDefault();

  if (!document.body.contains(paginationNext)) return;

  if (loader) loader.style.display = '';

  if (textNode && loadingText) textNode.textContent = loadingText;

  const nextPageURL = await loadListItems(listInstance, 'next');

  if (textNode && originalText) textNode.textContent = originalText || '';

  if (nextPageURL) paginationNext.href = nextPageURL;
  else paginationNext.remove();

  if (loader) loader.style.display = 'none';

  return nextPageURL;
};
