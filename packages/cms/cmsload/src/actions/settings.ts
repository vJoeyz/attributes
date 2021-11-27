import { extractCommaSeparatedValues, getCurrentBreakpoint } from '@finsweet/ts-utils';
import {
  ATTRIBUTES,
  BREAKPOINTS_INDEX,
  DEFAULT_INFINITE_THRESHOLD,
  DEFAULT_PAGE_BOUNDARY,
  DEFAULT_PAGE_SIBLINGS,
  getSelector,
} from '../utils/constants';

import type { PaginationButtonElement, PaginationWrapperElement } from '@finsweet/ts-utils';
import type { CMSList } from '$cms/cmscore/src';

// Constants
const {
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
export const getMainSettings = (
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
export const getPaginationSettings = (
  listInstance: CMSList
):
  | {
      listInstance: CMSList;
      paginationWrapper: PaginationWrapperElement;
      pageButtonTemplate?: HTMLElement | null;
      pageDotsTemplate: HTMLElement;
      paginationCount: HTMLDivElement | null | undefined;
      pageBoundary: number;
      pageBoundaryValues: number[];
      pageSiblings: number;
      pageSiblingsValues: number[];
      hasBreakpoints: boolean;
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

  const rawPageBoundaryValues = listInstance.getAttribute(pageBoundaryKey);
  const rawPageSiblingsValues = listInstance.getAttribute(pageSiblingsKey);

  const pageBoundaryValues = (rawPageBoundaryValues ? extractCommaSeparatedValues(rawPageBoundaryValues) : []).map(
    (value) => parseInt(value)
  );

  const pageSiblingsValues = (rawPageSiblingsValues ? extractCommaSeparatedValues(rawPageSiblingsValues) : []).map(
    (value) => parseInt(value)
  );

  const [pageBoundary, pageSiblings] = getPageButtonsSettings(pageBoundaryValues, pageSiblingsValues);

  const hasBreakpoints = [pageBoundaryValues, pageSiblingsValues].some(({ length }) => length > 1);

  return {
    listInstance,
    paginationWrapper,
    pageButtonTemplate,
    pageDotsTemplate,
    paginationCount,
    pageBoundary,
    pageBoundaryValues,
    pageSiblings,
    pageSiblingsValues,
    hasBreakpoints,
  };
};

/**
 * Returns the correspondent `pageBoundary` and `pageSiblings` settings based on the current breakpoint.
 * @param pageBoundaryValues The array of pageBoundary values.
 * @param pageSiblingsValues The array of pageSiblings values.
 * @returns A tuple with the correspondent values.
 */
export const getPageButtonsSettings = (
  pageBoundaryValues: number[],
  pageSiblingsValues: number[]
): [number, number] => {
  const currentBreakpoint = getCurrentBreakpoint();
  const breakpointIndex = BREAKPOINTS_INDEX[currentBreakpoint];

  const values: number[] = [];

  [pageBoundaryValues, pageSiblingsValues].forEach((array, index) => {
    for (let i = breakpointIndex; i >= 0; i--) {
      const value = array[i];

      if (typeof value === 'number') {
        values[index] = value;
        break;
      }
    }
  });

  let [pageBoundary, pageSiblings] = values;

  pageBoundary ??= DEFAULT_PAGE_BOUNDARY;
  pageSiblings ??= DEFAULT_PAGE_SIBLINGS;

  return [pageBoundary, pageSiblings];
};

/**
 * Collects the `Infinite` mode settings.
 * @param listInstance The {@link CMSList} instance.
 */
export const getInfiniteSettings = (
  listInstance: CMSList
): {
  threshold: number;
} => {
  const threshold = parseInt(listInstance.getAttribute(thresholdKey) || DEFAULT_INFINITE_THRESHOLD);

  return { threshold };
};
