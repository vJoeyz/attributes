import { getCollectionElements, getCollectionListWrappers } from '@finsweet/ts-utils';

import type { CMSList } from '$cms/cmscore/src';
import { checkCMSCoreVersion } from '$cms/utils/versioning';

export const parseLoadedPage = async (
  page: Document,
  listInstance: CMSList,
  itemsTarget?: Parameters<CMSList['addItems']>[1]
) => {
  const { index, paginationNext, paginationPrevious, originalItemsPerPage } = listInstance;

  // Get DOM Elements
  const collectionListWrapper = getCollectionListWrappers([], page)[index];
  if (!collectionListWrapper) return;

  // Store and mount the Pagination Previous element, if required
  if (!paginationPrevious || !paginationNext) {
    const newPaginationWrapper = getCollectionElements(collectionListWrapper, 'pagination');
    const newPaginationPrevious = getCollectionElements(collectionListWrapper, 'previous');
    const newPaginationNext = getCollectionElements(collectionListWrapper, 'next');

    if (newPaginationPrevious) {
      // TODO: Remove this check after `cmscore v1.5.0` has rolled out
      if (checkCMSCoreVersion('>=', '1.5.0')) {
        const childIndex = [...(newPaginationWrapper?.children || [])].indexOf(newPaginationPrevious);

        listInstance.addPaginationButton(newPaginationPrevious, 'paginationPrevious', childIndex);
      } else listInstance.addPaginationPrevious(newPaginationPrevious);
    }

    if (newPaginationNext) {
      // TODO: Remove this check after `cmscore v1.5.0` has rolled out
      if (checkCMSCoreVersion('>=', '1.5.0')) {
        let childIndex = [...(newPaginationWrapper?.children || [])].indexOf(newPaginationNext);

        if (!newPaginationPrevious) childIndex += 1;

        listInstance.addPaginationButton(newPaginationNext, 'paginationNext', childIndex);
      }
    }
  }

  // Store and mount the new items
  const nextPageURL = getCollectionElements(collectionListWrapper, 'next')?.href;
  const collectionItems = getCollectionElements(collectionListWrapper, 'items');

  const { length: itemsLength } = collectionItems;

  // Make sure the itemsPerPage value is correct
  if (nextPageURL && originalItemsPerPage !== itemsLength) {
    listInstance.originalItemsPerPage = listInstance.itemsPerPage = itemsLength;
  }

  await listInstance.addItems(collectionItems, itemsTarget);

  return nextPageURL;
};
