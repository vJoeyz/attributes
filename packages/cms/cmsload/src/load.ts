import { CMS_CSS_CLASSES, getCollectionElements } from '@finsweet/ts-utils';
import { ATTRIBUTES, getSelector } from './constants';

import type { PaginationButtonElement, CollectionListWrapperElement } from '@finsweet/ts-utils';
import type { CMSList } from 'packages/cms/CMSList';

// Constants
const {
  loading: { key: loadingKey },
} = ATTRIBUTES;

/**
 * DOM Parser to parse html strings.
 */
const domParser = new DOMParser();

/**
 * Collects all page links and Collection Items from a Collection List.
 * @param listInstance The CMSList instance.
 * @param index The action to perform.
 * @param limit The limit of items to be loaded, if existing.
 * @returns The URL of the next page to be loaded.
 */
export const loadListItems = async (listInstance: CMSList, action: 'next' | 'all'): Promise<string | undefined> => {
  const { index, paginationNext } = listInstance;
  const pageLinks: string[] = [];

  if (!paginationNext) return;

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
      const collectionListWrapper = page.querySelectorAll<CollectionListWrapperElement>(`.${CMS_CSS_CLASSES.wrapper}`)[
        index
      ];
      if (!collectionListWrapper) return;

      const collectionItems = getCollectionElements(collectionListWrapper, 'items');

      // Store and mount the new items
      listInstance.addItems(collectionItems);

      // Check for recursion (Mode: "Load All")
      nextPageURL = getCollectionElements(collectionListWrapper, 'next')?.href;

      if (nextPageURL && !pageLinks.includes(nextPageURL) && action === 'all') {
        pageLinks.push(nextPageURL);
        await loadPage({ href: nextPageURL });
      }
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
 * - Gets the loading text node, the loading text and the original text, if existing.
 * @param listInstance The `CMSList` instance.
 */
export const preparePagination = (
  listInstance: CMSList
):
  | {
      paginationNext: PaginationButtonElement;
      textNode: Node | null;
      originalText?: string | null;
      loadingText?: string | null;
    }
  | undefined => {
  const { paginationNext, paginationPrevious } = listInstance;

  if (!paginationNext) return;
  if (paginationPrevious) paginationPrevious.remove();

  const textNode = paginationNext.querySelector(getSelector('loading'));

  const originalText = textNode?.textContent;

  const loadingText = textNode?.getAttribute(loadingKey);

  return { paginationNext, textNode, originalText, loadingText };
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
}: {
  e?: MouseEvent;
  listInstance: CMSList;
} & ReturnType<typeof preparePagination>): ReturnType<typeof loadListItems> => {
  e?.preventDefault();

  if (!document.body.contains(paginationNext)) return;

  if (textNode && loadingText) textNode.textContent = loadingText;

  const nextPageURL = await loadListItems(listInstance, 'next');

  if (textNode && originalText) textNode.textContent = originalText || '';

  if (nextPageURL) paginationNext.href = nextPageURL;
  else paginationNext.remove();

  return nextPageURL;
};
