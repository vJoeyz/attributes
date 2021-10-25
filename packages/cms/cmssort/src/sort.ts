import type { CMSItem, CMSList } from 'packages/cms/cmscore/src';
import type { SortingDirection } from './types';

/**
 * Sorts the items of a {@link CMSList}.
 * **Important:** This method mutates the {@link CMSList.items} property.
 *
 * @param listInstance The `CMSList` instance.
 * @param params.originalItemsOrder The original order of the items.
 * @param params.direction The direction to sort.
 * @param params.sortKey The key of the field to use as sorting reference.
 */
export const sortListItems = async (
  listInstance: CMSList,
  {
    originalItemsOrder,
    direction,
    sortKey,
  }: {
    originalItemsOrder: CMSItem[];
    direction?: SortingDirection;
    sortKey?: string;
  }
) => {
  const { items } = listInstance;

  const validSortKey = direction && sortKey && items.some(({ props }) => sortKey in props);

  // Sort items by the key and value type
  if (validSortKey) {
    items.sort((firstItem, secondItem) => {
      const firstItemProp = firstItem.props[sortKey];
      const secondItemProp = secondItem.props[sortKey];

      const [firstItemValue] = firstItemProp?.values || [];
      const [secondItemValue] = secondItemProp?.values || [];

      if (!firstItemValue) return 0;
      if (!secondItemValue) return 1;

      const { type } = firstItemProp;

      if (type === 'date') {
        const firstItemTime = new Date(firstItemValue).getTime();
        const secondItemTime = new Date(secondItemValue).getTime();

        if (direction === 'asc') return firstItemTime - secondItemTime;

        return secondItemTime - firstItemTime;
      }

      if (direction === 'asc') return firstItemValue.localeCompare(secondItemValue);

      return secondItemValue.localeCompare(firstItemValue);
    });
  }
  // Return to original order
  else listInstance.items = [...originalItemsOrder];

  // Render the new order
  await renderListItems(listInstance);
};

/**
 * Renders the {@link CMSList.items} in the current order of the array.
 *
 * @param listInstance The `CMSList` instance.
 * @param animateList Defines if the list should be animated (`fadeOut` + `fadeIn`) during the action.
 */
const renderListItems = async (listInstance: CMSList, animateList = true) => {
  const { list, items } = listInstance;

  if (animateList) await listInstance.displayList(false, animateList);

  for (const { element } of items) list.appendChild(element);

  if (animateList) await listInstance.displayList(true, animateList);
};
