import { loadListItems } from '../load';
import { collectMainSettings } from '../settings';

import type { CMSList } from '$cms/cmscore/src';

/**
 * Inits the `Render All` mode.
 * @param listInstance The `CMSList` instance.
 * @param loadingText The text to display while loading.
 */
export const initRenderAllMode = async (listInstance: CMSList): Promise<void> => {
  const settingsData = collectMainSettings(listInstance);
  if (!settingsData) return;

  const { paginationNext, paginationNextTextNode, loadingText } = settingsData;

  const handleClicks = (e: MouseEvent) => {
    e.preventDefault();
    return false;
  };

  paginationNext.addEventListener('click', handleClicks);

  await listInstance.displayElement('loader');

  if (paginationNextTextNode && loadingText) paginationNextTextNode.textContent = loadingText;

  await loadListItems(listInstance, 'all');

  paginationNext.removeEventListener('click', handleClicks);
  paginationNext.remove();

  await listInstance.displayElement('loader', false);
};
