import { CMSList } from '.';

/**
 * Updates the {@link CMSList.itemsCount} element with the total amount of items.
 * @param listInstance A {@link CMSList} instance.
 */
export const updateItemsCount = ({ itemsCount, items }: CMSList) => {
  if (itemsCount) itemsCount.textContent = `${items.length}`;
};
