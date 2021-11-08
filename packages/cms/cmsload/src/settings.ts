import {
  ATTRIBUTES,
  DEFAULT_INFINITE_THRESHOLD,
  DEFAULT_PAGE_BOUNDARY,
  DEFAULT_PAGE_SIBLINGS,
  getSelector,
} from './constants';

import type { PaginationButtonElement, PaginationWrapperElement } from '@finsweet/ts-utils';
import type { CMSList } from '$cms/cmscore/src';

// Constants
const {
  element: { key: elementKey },
  loading: { key: loadingKey },
  pageSiblings: { key: pageSiblingsKey },
  pageBoundary: { key: pageBoundaryKey },
  threshold: { key: thresholdKey },
} = ATTRIBUTES;

/**
 * Prepares the `CMSList` instance:
 * - Gets and prepares the pagination buttons.
 * - Gets the user's settings.
 * @param listInstance The {@link CMSList} instance.
 */
export const collectMainSettings = (
  listInstance: CMSList
):
  | {
      listInstance: CMSList;
      paginationNext: PaginationButtonElement;
      paginationNextTextNode: Node | null;
      originalNextText?: string | null;
      loadingText?: string | null;
    }
  | undefined => {
  const { paginationNext, paginationPrevious } = listInstance;

  if (!paginationNext) return;

  paginationPrevious?.remove();

  const paginationNextTextNode = paginationNext.querySelector(getSelector('loading'));

  const originalNextText = paginationNextTextNode?.textContent;

  const loadingText = paginationNextTextNode?.getAttribute(loadingKey);

  const instanceIndex = listInstance.getInstanceIndex(elementKey);

  const loaderElement = document.querySelector<HTMLElement>(getSelector('element', 'loader', { instanceIndex }));
  if (loaderElement) listInstance.addLoader(loaderElement);

  return {
    listInstance,
    paginationNext,
    paginationNextTextNode,
    originalNextText,
    loadingText,
  };
};

/**
 * Collects the `Pagination` mode settings.
 * @param listInstance The {@link CMSList} instance.
 */
export const collectPaginationSettings = (
  listInstance: CMSList
):
  | {
      listInstance: CMSList;
      paginationWrapper: PaginationWrapperElement;
      pageButtonTemplate?: HTMLElement | null;
      pageDotsTemplate: HTMLElement;
      paginationCount: HTMLDivElement | null | undefined;
      pageSiblings: number;
      pageBoundary: number;
    }
  | undefined => {
  const { paginationWrapper, paginationCount } = listInstance;

  if (!paginationWrapper) return;

  const pageButtonTemplate = paginationWrapper.querySelector<HTMLElement>(
    getSelector('element', 'pageButton', { operator: 'prefixed' })
  );

  let pageDotsTemplate = paginationWrapper.querySelector<HTMLElement>(
    getSelector('element', 'pageDots', { operator: 'prefixed' })
  );

  if (pageDotsTemplate) pageDotsTemplate.remove();
  else {
    pageDotsTemplate = document.createElement('div');
    pageDotsTemplate.textContent = '...';
  }

  const pageSiblings = parseInt(listInstance.getAttribute(pageSiblingsKey) || DEFAULT_PAGE_SIBLINGS);
  const pageBoundary = parseInt(listInstance.getAttribute(pageBoundaryKey) || DEFAULT_PAGE_BOUNDARY);

  return {
    listInstance,
    paginationWrapper,
    pageButtonTemplate,
    pageDotsTemplate,
    paginationCount,
    pageSiblings,
    pageBoundary,
  };
};

/**
 * Collects the `Infinite` mode settings.
 * @param listInstance The {@link CMSList} instance.
 */
export const collectInfiniteSettings = (
  listInstance: CMSList
): {
  threshold: number;
} => {
  const threshold = parseInt(listInstance.getAttribute(thresholdKey) || DEFAULT_INFINITE_THRESHOLD);

  return { threshold };
};
