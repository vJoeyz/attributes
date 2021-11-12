import { ATTRIBUTES } from './constants';

import type { CMSItem, CMSList } from '$cms/cmscore/src';
import type { SortItemsCallback } from './types';

// Constants destructuring
const {
  field: { key: fieldKey },
  type: { key: typeKey },
} = ATTRIBUTES;

/**
 * Reacts to a `CMSList` events.
 * @param listInstance A {@link CMSList} instance.
 * @param originalItemsOrder The original order of {@link CMSItem} instances.
 * @param sortItems A callback to sort the items in the currently selected order.
 */
export const listenListEvents = (
  listInstance: CMSList,
  originalItemsOrder: CMSItem[],
  sortItems: SortItemsCallback
) => {
  listInstance.on('shouldcollectprops', async (newItems) => {
    for (const item of newItems) item.collectProps({ fieldKey, typeKey });
  });

  listInstance.on('shouldsort', async (newItems) => {
    originalItemsOrder.push(...newItems);

    await sortItems(true);
  });
};
