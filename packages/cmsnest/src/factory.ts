import type { CMSList } from '@finsweet/attributes-cmscore';

import { getNestSources } from './actions/collect';
import { listenListEvents } from './actions/events';
import { populateNestedCollections } from './actions/populate';
import { hasAttributeValue } from './utils/selectors';

/**
 * Inits the nesting.
 * @param listInstance A {@link CMSList} instance.
 */
export const initListNesting = async (listInstance: CMSList): Promise<void> => {
  // Collect the collections to nest
  const nestSources = getNestSources();
  if (!nestSources.size) return;

  // Listen for events
  listenListEvents(listInstance, nestSources);

  // Get caching options
  const disableCache = hasAttributeValue(listInstance.listOrWrapper, 'cache', 'false');
  if (disableCache) {
    listInstance.cacheItems = false;
  }

  // Nest existing items
  const existingItems = [...listInstance.items];

  await Promise.all(existingItems.map((item) => populateNestedCollections(item, nestSources, listInstance.cacheItems)));
  await listInstance.emitSerial('nestinitialitems', existingItems);
};
