import throttle from 'just-throttle';
import { loadNextPage } from '../actions/load';
import { getInfiniteSettings, getMainSettings } from '../actions/settings';

import type { CMSList } from '$cms/cmscore/src';

/**
 * Inits the infinite mode.
 * @param listInstance The `CMSList` instance.
 */
export const initInfiniteMode = (listInstance: CMSList): void => {
  const settingsData = getMainSettings(listInstance);
  if (!settingsData) return;

  const { threshold } = getInfiniteSettings(listInstance);
  const thresholdCoefficient = 1 - threshold / 100;

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

    const validRange = thresholdCoefficient * innerHeight;
    const shouldLoad = bottom > 0 && bottom <= validRange;

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
