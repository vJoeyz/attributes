import { CMS_CSS_CLASSES, Debug, getCollectionElements } from '@finsweet/ts-utils';
import { CMSItem, CMSList } from '.';

import type { CollectionListWrapperElement, CollectionItemElement } from '@finsweet/ts-utils';

/**
 * Creates a new `CMSList` instance, making sure there are no already existing instances on the page.
 * @param referenceElement The `Collection List` reference element.
 * @returns A new `CMSList` instance, if instantiation was valid.
 */
export const createCMSListInstance = (referenceElement: HTMLElement): CMSList | undefined => {
  const wrapper = getCollectionElements(referenceElement, 'wrapper');

  if (!wrapper) {
    Debug.alert('The element is not a Collection List.', 'error');
    return;
  }

  const { fsAttributes } = window;

  fsAttributes.cms.lists ||= [];
  fsAttributes.cms.listElements ||= [
    ...document.querySelectorAll<CollectionListWrapperElement>(`.${CMS_CSS_CLASSES.wrapper}`),
  ];

  const { lists, listElements } = fsAttributes.cms;

  const pageIndex = listElements.indexOf(wrapper);
  if (pageIndex === -1) return;

  lists[pageIndex] ||= new CMSList(wrapper, { pageIndex });

  return lists[pageIndex];
};

/**
 * Stores new Collection Items in a `CMSList` instance.
 * **Important:** It mutates the {@link CMSList.items} object.
 * @param listInstance The `CMSList` instance.
 * @param newItemElements The new Collection Items to store.
 */
export const addItemsToList = async (
  listInstance: CMSList,
  newItemElements: CollectionItemElement[]
): Promise<void> => {
  const { items, list, showNewItems } = listInstance;

  const newItems = newItemElements.map((item) => new CMSItem(item, list));

  items.push(...newItems);

  await listInstance.emitSerial('beforeadditems', newItems);

  if (showNewItems) await listInstance.renderItems(newItems);

  await listInstance.emitSerial('afteradditems', newItems);
};
