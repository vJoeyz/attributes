import throttle from 'just-throttle';
import { ATTRIBUTES, DEFAULT_INFINITE_THRESHOLD } from './constants';
import { handleLoadPage, loadListItems, preparePagination } from './load';

import type { CMSList } from 'packages/cms/CMSList';

// Constants
const {
  threshold: { key: thresholdKey },
} = ATTRIBUTES;

/**
 * Inits the main mode.
 * @param listInstance The `CMSList` instance.
 * @param loadingText The text to display while loading.
 */
export const initDefaultMode = (listInstance: CMSList): void => {
  const paginationData = preparePagination(listInstance);
  if (!paginationData) return;

  const { paginationNext } = paginationData;

  /**
   * Handles click events on the `Pagination Next` button.
   * @param e The mouse event.
   */
  const handleClicks = async (e: MouseEvent) => {
    const nextPageURL = await handleLoadPage({ e, ...paginationData });

    if (!nextPageURL) paginationNext.removeEventListener('click', handleClicks);
  };

  paginationNext.addEventListener('click', handleClicks);
};

/**
 * Inits the main mode.
 * @param listInstance The `CMSList` instance.
 * @param loadingText The text to display while loading.
 */
export const initInfiniteMode = (listInstance: CMSList): void => {
  const paginationData = preparePagination(listInstance);
  if (!paginationData) return;

  const { paginationNext } = paginationData;
  const { list } = listInstance;

  paginationNext.addEventListener('click', (e) => {
    handleLoadPage({ e, ...paginationData });
  });

  const threshold = parseInt(listInstance.getAttribute(thresholdKey) || DEFAULT_INFINITE_THRESHOLD);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(({ isIntersecting }) => {
      window[isIntersecting ? 'addEventListener' : 'removeEventListener']('scroll', handleScroll);
    });
  });

  observer.observe(list);

  /**
   * Handles a scroll event.
   * Recalculates the scroll ratio of the element.
   */
  const handleScroll = throttle(async () => {
    const { innerHeight } = window;
    const { bottom } = list.getBoundingClientRect();

    const distance = innerHeight - bottom;
    const percentage = (distance * 100) / innerHeight;

    const shouldLoad =
      (Math.sign(threshold) === 1 && percentage > threshold && percentage > 0) ||
      (Math.sign(threshold) < 1 && percentage > threshold && percentage < 0);

    if (shouldLoad) {
      const nextPageURL = await handleLoadPage(paginationData);

      if (!nextPageURL) {
        window.removeEventListener('scroll', handleScroll);
        observer.disconnect();
      }
    }
  }, 100);
};

/**
 * Inits the `Load All` mode.
 * @param listInstance The `CMSList` instance.
 * @param loadingText The text to display while loading.
 */
export const initLoadAllMode = async (listInstance: CMSList): Promise<void> => {
  const paginationData = preparePagination(listInstance);
  if (!paginationData) return;

  const { paginationNext, textNode, loadingText, loader, resetIx } = paginationData;

  const handleClicks = (e: MouseEvent) => {
    e.preventDefault();
    return false;
  };

  paginationNext.addEventListener('click', handleClicks);

  if (loader) loader.style.display = '';

  if (textNode && loadingText) textNode.textContent = loadingText;

  await loadListItems(listInstance, 'all', resetIx);

  paginationNext.removeEventListener('click', handleClicks);
  paginationNext.remove();

  if (loader) loader.style.display = 'none';
};
