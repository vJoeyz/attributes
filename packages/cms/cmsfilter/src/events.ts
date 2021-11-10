import { ATTRIBUTES } from './constants';
import { toggleHighlight } from './highlight';

import type { CMSFilters } from './CMSFilters';
import type { CMSItem, CMSList } from '$cms/cmscore/src';

const {
  field: { key: fieldKey },
  range: { key: rangeKey },
  type: { key: typeKey },
} = ATTRIBUTES;

/**
 * Listens for events on the `CMSList` and triggers the correspondent actions.
 * @param filtersInstance The {@link CMSFilters} instance.
 * @param listInstance The {@link CMSList} instance.
 */
export const listenListEvents = (filtersInstance: CMSFilters, listInstance: CMSList) => {
  const { highlightActivated, highlightCSSClass } = filtersInstance;

  listInstance.on('shouldcollectprops', (items: CMSItem[]) => {
    for (const item of items) item.collectProps({ fieldKey, rangeKey, typeKey });
  });

  listInstance.on('shouldfilter', async () => await filtersInstance.applyFilters(true));

  listInstance.on('renderitems', (renderedItems) => {
    filtersInstance.updateResults();

    if (highlightActivated) for (const item of renderedItems) toggleHighlight(item, highlightCSSClass);
  });

  listInstance.once('nestinitialitems').then(async (items: CMSItem[]) => {
    for (const item of items) item.collectProps({ fieldKey, rangeKey, typeKey });

    await filtersInstance.applyFilters();
  });
};
