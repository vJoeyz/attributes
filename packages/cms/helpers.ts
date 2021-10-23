import { CMS_CSS_CLASSES, getCollectionElements } from '@finsweet/ts-utils';
import { CMSItem } from './CMSList';

import type { CollectionItemElement, CollectionListWrapperElement } from '@finsweet/ts-utils';
import type { CMSList } from './CMSList';

/**
 * Queries `Collection List Wrapper` elements and makes sure they are unique.
 * @param selectors The selectors used for the query. If an empty array is provided, all `Collection List Wrapper` elements will be returned.
 * @param page The document where to perform the query.
 * @returns A unique list of `Collection List Wrapper` elements.
 */
export const getCollectionListWrappers = (
  selectors: Array<string | null | undefined>,
  page = document
): CollectionListWrapperElement[] => {
  // Make sure the selectors are valid.
  selectors = selectors.filter((selector) => selector);

  const selector = selectors.join(', ') || `.${CMS_CSS_CLASSES.wrapper}`;

  const referenceElements = [...page.querySelectorAll<HTMLElement>(selector)];

  const collectionListWrappers = referenceElements.reduce<CollectionListWrapperElement[]>(
    (wrappers, referenceElement) => {
      if (!referenceElement) return wrappers;

      const collectionListWrapper = getCollectionElements(referenceElement, 'wrapper');
      if (!collectionListWrapper || wrappers.includes(collectionListWrapper)) return wrappers;

      wrappers.push(collectionListWrapper);

      return wrappers;
    },
    []
  );

  return collectionListWrappers;
};

/**
 * Stores new Collection Items in a `CMSList` instance.
 * @param listInstance The CMSList instance.
 * @param newItemElements The new Collection Items to store.
 */
export const addItemsToList = async (
  listInstance: CMSList,
  newItemElements: CollectionItemElement[]
): Promise<void> => {
  const { items, list, showNewItems } = listInstance;

  const newItems = newItemElements.map((item) => new CMSItem(item, list));

  items.push(...newItems);

  await listInstance.emitSerial('additems', newItems);

  if (showNewItems) await listInstance.renderItems(newItems);
};
