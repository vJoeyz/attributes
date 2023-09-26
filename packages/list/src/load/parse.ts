import { CMS_CSS_CLASSES } from '@finsweet/attributes-utils';

import type { List } from '../components/List';
import { getCollectionElements } from '../utils/dom';

export const parseLoadedPage = async (page: Document, list: List, itemsTarget?: Parameters<List['addItems']>[1]) => {
  const { pageIndex, paginationNextElement, paginationPreviousElement, itemsPerPage } = list;

  // Get DOM Elements
  const allCollectionWrappers = page.querySelectorAll(`.${CMS_CSS_CLASSES.wrapper}`);
  const collectionListWrapper = allCollectionWrappers[pageIndex];
  if (!collectionListWrapper) return;

  // Store and mount the Pagination Previous element, if required
  if (!paginationPreviousElement.get() || !paginationNextElement.get()) {
    const newPaginationWrapper = getCollectionElements(collectionListWrapper, 'pagination-wrapper');
    const newPaginationPrevious = getCollectionElements(collectionListWrapper, 'pagination-previous');
    const newPaginationNext = getCollectionElements(collectionListWrapper, 'pagination-next');

    if (newPaginationPrevious) {
      const childIndex = [...(newPaginationWrapper?.children || [])].indexOf(newPaginationPrevious);

      list.addPaginationButton(newPaginationPrevious, 'paginationPreviousElement', childIndex);
    }

    if (newPaginationNext) {
      let childIndex = [...(newPaginationWrapper?.children || [])].indexOf(newPaginationNext);

      if (!newPaginationPrevious) childIndex += 1;

      list.addPaginationButton(newPaginationNext, 'paginationNextElement', childIndex);
    }
  }

  // Store and mount the new items
  const nextPageURL = getCollectionElements(collectionListWrapper, 'pagination-next')?.href;
  const collectionItems = getCollectionElements(collectionListWrapper, 'item');

  const { length: itemsLength } = collectionItems;

  // Make sure the itemsPerPage value is correct
  if (nextPageURL && itemsPerPage.get() !== itemsLength) {
    itemsPerPage.set(itemsLength);
  }

  list.addItems(collectionItems, itemsTarget);

  return nextPageURL;
};
