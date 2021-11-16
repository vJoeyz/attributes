import type { CMSItem, CMSList } from '$cms/cmscore/src';
import type { SortingDirection } from './types';

/**
 * Sorts the items of a `CMSList`.
 * **Important:** This method mutates the {@link CMSList.items} property.
 *
 * @param listInstance The {@link CMSList} instance.
 * @param params.originalItemsOrder The original order of the items.
 * @param params.direction The direction to sort.
 * @param params.sortKey The key of the field to use as sorting reference.
 * @param params.addingItems Defines if new items are being added.
 * In that case, the rendering responsibilities are handled by the {@link CMSList} controller.
 */
export const sortListItems = async (
  listInstance: CMSList,
  {
    originalItemsOrder,
    direction,
    sortKey,
    addingItems,
  }: {
    originalItemsOrder: CMSItem[];
    direction?: SortingDirection;
    sortKey?: string;
    addingItems?: boolean;
  }
) => {
  const { items, currentPage } = listInstance;

  const validSortKey = direction && sortKey && items.some(({ props }) => sortKey in props);

  if (!validSortKey) listInstance.items = [...originalItemsOrder];
  else {
    items.sort((firstItem, secondItem) => {
      const firstItemProp = firstItem.props[sortKey];
      const secondItemProp = secondItem.props[sortKey];

      const [firstItemValue] = firstItemProp?.values || [];
      const [secondItemValue] = secondItemProp?.values || [];

      if (!firstItemValue) return 1;
      if (!secondItemValue) return -1;

      const { type } = firstItemProp;

      if (type === 'date') {
        const firstItemTime = new Date(firstItemValue).getTime();
        const secondItemTime = new Date(secondItemValue).getTime();

        if (direction === 'asc') return firstItemTime - secondItemTime;

        return secondItemTime - firstItemTime;
      }

      const collatorOptions: Intl.CollatorOptions = {
        numeric: true,
        sensitivity: 'base',
      };

      if (direction === 'asc') return firstItemValue.localeCompare(secondItemValue, undefined, collatorOptions);

      return secondItemValue.localeCompare(firstItemValue, undefined, collatorOptions);
    });
  }

  // Render the new order
  if (!addingItems) {
    if (currentPage) listInstance.currentPage = 1;

    listInstance.scrollToAnchor();

    await listInstance.renderItems();
  }
};
