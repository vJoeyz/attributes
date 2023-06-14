import type { CMSList } from '@finsweet/attributes-cmscore';
import { parseNumericAttribute } from '@finsweet/attributes-utils';
import type { PaginationWrapperElement } from '@finsweet/ts-utils';
import { extractCommaSeparatedValues, getCurrentBreakpoint, isNumber } from '@finsweet/ts-utils';

import {
  BREAKPOINTS_INDEX,
  DEFAULT_INFINITE_THRESHOLD,
  DEFAULT_PAGE_BOUNDARY,
  DEFAULT_PAGE_SIBLINGS,
  SETTINGS,
} from '../utils/constants';
import { getAttribute, hasAttributeValue, queryElement } from '../utils/selectors';

/**
 * Collects the `Pagination` mode settings.
 * @param listInstance The {@link CMSList} instance.
 */
export const getPaginationSettings = (
  listInstance: CMSList
):
  | {
      paginationWrapper: PaginationWrapperElement;
      pageButtonTemplate?: HTMLElement | null;
      pageDotsTemplate: HTMLElement;
      paginationCount: HTMLDivElement | null | undefined;
      pageBoundary: number;
      pageBoundaryValues: number[];
      pageSiblings: number;
      pageSiblingsValues: number[];
      hasBreakpoints: boolean;
      showQueryParams: boolean;
    }
  | undefined => {
  const { paginationWrapper, paginationCount, listOrWrapper } = listInstance;

  if (!paginationWrapper) return;

  // Page Button Template
  const pageButtonTemplate = queryElement('page-button', {
    scope: paginationWrapper,
  });

  // Page Dots Template
  let pageDotsTemplate = queryElement('page-dots', { scope: paginationWrapper });

  if (pageDotsTemplate) pageDotsTemplate.remove();
  else {
    pageDotsTemplate = document.createElement('div');
    pageDotsTemplate.textContent = '...';
  }

  // Page Boundary
  const rawPageBoundaryValues = getAttribute(listOrWrapper, 'pageboundary');
  const pageBoundaryValues = (rawPageBoundaryValues ? extractCommaSeparatedValues(rawPageBoundaryValues) : []).map(
    (value) => parseInt(value)
  );

  // Page Siblings
  const rawPageSiblingsValues = getAttribute(listOrWrapper, 'pagesiblings');
  const pageSiblingsValues = (rawPageSiblingsValues ? extractCommaSeparatedValues(rawPageSiblingsValues) : []).map(
    (value) => parseInt(value)
  );

  // Breakpoints for Page Boundary/Siblings
  const [pageBoundary, pageSiblings] = getPageButtonsSettings(pageBoundaryValues, pageSiblingsValues);

  const hasBreakpoints = [pageBoundaryValues, pageSiblingsValues].some(({ length }) => length > 1);

  // Query Params
  const showQueryParams = hasAttributeValue(listOrWrapper, 'showquery', 'true');

  return {
    paginationWrapper,
    pageButtonTemplate,
    pageDotsTemplate,
    paginationCount,
    pageBoundary,
    pageBoundaryValues,
    pageSiblings,
    pageSiblingsValues,
    hasBreakpoints,
    showQueryParams,
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

      if (isNumber(value)) {
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
export const getInfiniteThreshold = ({ listOrWrapper }: CMSList): number => {
  const rawThreshold = getAttribute(listOrWrapper, 'threshold');
  const threshold = parseNumericAttribute(rawThreshold, DEFAULT_INFINITE_THRESHOLD);

  const thresholdCoefficient = 1 - threshold / 100;
  return thresholdCoefficient;
};
