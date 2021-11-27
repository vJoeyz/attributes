import { ATTRIBUTES } from '../utils/constants';
import { toggleHighlight } from './highlight';
import { syncFilterKeyResults, updateFilterKeyResults, updateListResults } from './results';
import { displayFilterElements } from './display';

import type { CMSFilters } from '../components/CMSFilters';
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
  const { highlightResults, highlightCSSClass, showFilterResults, hideEmptyFilters } = filtersInstance;

  listInstance.on('shouldcollectprops', (items: CMSItem[]) => {
    for (const item of items) item.collectProps({ fieldKey, rangeKey, typeKey });
  });

  listInstance.on('shouldfilter', async () => await filtersInstance.applyFilters(true));

  listInstance.on('renderitems', (renderedItems) => {
    updateListResults(filtersInstance, listInstance);

    syncFilterKeyResults(filtersInstance, listInstance);

    if (hideEmptyFilters) displayFilterElements(filtersInstance);

    if (showFilterResults) updateFilterKeyResults(filtersInstance);

    if (highlightResults) for (const item of renderedItems) toggleHighlight(item, highlightCSSClass);
  });

  listInstance.once('nestinitialitems').then(async (items: CMSItem[]) => {
    for (const item of items) item.collectProps({ fieldKey, rangeKey, typeKey });

    await filtersInstance.applyFilters(true);
    await listInstance.renderItems(true);
  });
};
