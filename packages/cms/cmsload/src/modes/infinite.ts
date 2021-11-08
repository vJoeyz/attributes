import throttle from 'just-throttle';
import { loadNextPage } from '../load';
import { collectInfiniteSettings, collectMainSettings } from '../settings';

import type { CMSList } from '$cms/cmscore/src';

/**
 * Inits the infinite mode.
 * @param listInstance The `CMSList` instance.
 */
export const initInfiniteMode = (listInstance: CMSList): void => {
  const settingsData = collectMainSettings(listInstance);
  const { threshold } = collectInfiniteSettings(listInstance);
  if (!settingsData) return;

  let isLoading = false;

  const { paginationNext } = settingsData;
  const { list } = listInstance;

  paginationNext.addEventListener('click', async (e) => {
    e.preventDefault();

    if (isLoading) return;

    isLoading = true;

    await loadNextPage({ e, ...settingsData });

    isLoading = false;
  });

  const observer = new IntersectionObserver((entries) => {
    for (const { isIntersecting } of entries) {
      const action = isIntersecting ? 'addEventListener' : 'removeEventListener';
      window[action]('scroll', handleScroll);
    }
  });

  observer.observe(list);

  /**
   * Handles a scroll event.
   * Recalculates the scroll ratio of the element.
   */
  const handleScroll = throttle(async () => {
    if (isLoading) return;

    const { innerHeight } = window;
    const { bottom } = list.getBoundingClientRect();

    const thresholdSign = Math.sign(threshold);
    const distance = innerHeight - bottom;
    const percentage = (distance * 100) / innerHeight;

    const shouldLoad =
      (thresholdSign === 1 && percentage > threshold && percentage > 0) ||
      (thresholdSign < 1 && percentage > threshold && percentage < 0);

    if (shouldLoad) {
      isLoading = true;

      const nextPageURL = await loadNextPage(settingsData);

      if (!nextPageURL) {
        window.removeEventListener('scroll', handleScroll);
        observer.disconnect();
      }

      isLoading = false;
    }
  }, 100);
};
