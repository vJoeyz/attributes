import { TableData } from '../utils/types';

/**
 * Sets scroll offset to all headings using CSS scroll-margin.
 * @param tableWrapper
 * @param tableData
 * @param scrollOffsetTop
 * @param scrollOffsetBottom
 */
export const setScrollOffset = (
  tableWrapper: HTMLElement,
  tableData: TableData[],
  scrollOffsetTop: string | null,
  scrollOffsetBottom: string | null
) => {
  document.documentElement.style.scrollBehavior = 'smooth';

  for (const { headingElement } of tableData) {
    if (!headingElement) continue;

    if (scrollOffsetTop) headingElement.style.scrollMarginTop = scrollOffsetTop;
    if (scrollOffsetBottom) headingElement.style.scrollMarginBottom = scrollOffsetBottom;
  }

  tableWrapper.addEventListener('click', (e) => {
    if (e.target instanceof Element && e.target.closest('a')) e.stopPropagation();
  });
};
