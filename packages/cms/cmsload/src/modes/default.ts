import { loadNextPage } from '../actions/load';
import { getMainSettings } from '../actions/settings';

import type { CMSList } from '$cms/cmscore/src';

/**
 * Inits the default mode.
 * @param listInstance The `CMSList` instance.
 */
export const initDefaultMode = (listInstance: CMSList): void => {
  const settingsData = getMainSettings(listInstance);
  if (!settingsData) return;

  let isLoading = false;

  const { paginationNext } = settingsData;

  /**
   * Handles click events on the `Pagination Next` button.
   * @param e The mouse event.
   */
  const handleClicks = async (e: MouseEvent) => {
    e.preventDefault();

    if (isLoading) return;

    isLoading = true;

    const nextPageURL = await loadNextPage({ e, ...settingsData });

    if (!nextPageURL) paginationNext.removeEventListener('click', handleClicks);

    isLoading = false;
  };

  paginationNext.addEventListener('click', handleClicks);
};
