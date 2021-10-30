import { ATTRIBUTES } from './constants';

import type { CMSFilters } from './CMSFilter';
import type { CMSItem, CMSList } from '$cms/cmscore/src';
import type { CMSCore } from '$cms/cmscore/src/types';

const {
  field: { key: fieldKey },
  range: { key: rangeKey },
  type: { key: typeKey },
} = ATTRIBUTES;

/**
 * Listens for events on the `CMSList` and triggers the correspondent actions.
 * @param listInstance The {@link CMSFilters} instance.
 * @param listInstance The {@link CMSList} instance.
 * @param cmsCore The {@link CMSCore} import.
 */
export const listenListEvents = (
  filtersInstance: CMSFilters,
  listInstance: CMSList,
  { collectItemsProps }: CMSCore
) => {
  listInstance.on('shouldcollectprops', (items: CMSItem[]) => {
    collectItemsProps(items, { fieldKey, rangeKey, typeKey });
  });

  listInstance.on('shouldfilter', async () => await filtersInstance.applyFilters(true));

  listInstance.on('nestinitialitems', async (items: CMSItem[]) => {
    collectItemsProps(items, { fieldKey, rangeKey, typeKey });
    await filtersInstance.applyFilters();
  });

  listInstance.on('renderitems', () => filtersInstance.updateResults());
};
