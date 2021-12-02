import { getCollectionElements, getCollectionListWrappers } from '@finsweet/ts-utils';

import type { CMSList } from '$cms/cmscore/src';

/**
 * DOM Parser to parse `HTML` strings.
 */
const domParser = new DOMParser();

export const parseLoadedPage = async (rawPage: string, listInstance: CMSList) => {
  const { index, paginationPrevious } = listInstance;

  if (typeof index !== 'number') return;

  const page = domParser.parseFromString(rawPage, 'text/html');

  // Get DOM Elements
  const collectionListWrapper = getCollectionListWrappers([], page)[index];
  if (!collectionListWrapper) return;

  // Store and mount the Pagination Previous element, if required
  if (!paginationPrevious) {
    const newPaginationPrevious = getCollectionElements(collectionListWrapper, 'previous');

    if (newPaginationPrevious) listInstance.addPaginationPrevious(newPaginationPrevious);
  }

  // Store and mount the new items
  const nextPageURL = getCollectionElements(collectionListWrapper, 'next')?.href;
  const collectionItems = getCollectionElements(collectionListWrapper, 'items');

  await listInstance.addItems(collectionItems);

  return nextPageURL;
};
