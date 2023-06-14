import type { CMSList } from '@finsweet/attributes-cmscore';

import { SETTINGS } from '../utils/constants';
import type { SortItemsCallback } from '../utils/types';

// Constants destructuring
const {
  field: { key: fieldKey },
  type: { key: typeKey },
} = SETTINGS;

/**
 * Reacts to a `CMSList` events.
 * @param listInstance A {@link CMSList} instance.
 * @param sortItems A callback to sort the items in the currently selected order.
 */
export const listenListEvents = (listInstance: CMSList, sortItems: SortItemsCallback) => {
  listInstance.on('shouldcollectprops', async (newItems) => {
    for (const item of newItems) item.collectProps({ fieldKey, typeKey });
  });

  listInstance.on('shouldsort', async () => {
    await sortItems(true);
  });
};
