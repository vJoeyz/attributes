import { ATTRIBUTES, getSelector } from './constants';
import { getCollectionListWrappers } from 'packages/cms/helpers';
import { createCMSListInstance } from 'packages/cms/CMSList';
import { restartWebflow, TABS_CSS_CLASSES, isNotEmpty } from '@finsweet/ts-utils';
import { populateTabsFromLists } from './populate';

import type { CMSList } from 'packages/cms/CMSList';
import type { TabsElement } from '@finsweet/ts-utils';

// Types
interface PopulateData {
  listInstances: CMSList[];
  tabsElement: TabsElement;
}

/**
 * Inits the attribute.
 *
 * Auto init:
 * @param params The current `<script>` element.
 *
 * Programatic init:
 * @param params.param A global parameter.
 */
export const init = async (): Promise<void> => {
  const collectionListWrappers = getCollectionListWrappers([getSelector('element', 'list', { operator: 'prefixed' })]);

  const listInstances = collectionListWrappers.map(createCMSListInstance).filter(isNotEmpty);

  // Collect the combine data
  let populateData: PopulateData[] = [];

  for (const listInstance of listInstances) {
    const instanceIndex = listInstance.getInstanceIndex(ATTRIBUTES.element.key);

    // Get the slider target
    const tabsElement = document.querySelector<TabsElement>(
      `.${TABS_CSS_CLASSES.tabs}${getSelector('element', 'tabs', { instanceIndex })}`
    );

    if (!tabsElement) continue;

    // Make sure the populate data exists
    const data = (populateData[instanceIndex || 0] ||= { listInstances: [], tabsElement });

    // Collect the list
    data.listInstances.push(listInstance);
  }

  // Filter out invalid instances
  populateData = populateData.filter((data) => data && data.listInstances.length);

  // Populate the sliders
  for (const data of populateData) {
    const { listInstances } = data;

    const createTabsFromItems = populateTabsFromLists(data);

    // Listen events
    for (const listInstance of listInstances) {
      listInstance.on('afteradditems', (newItems) => {
        createTabsFromItems?.(newItems);
      });

      listInstance.on('finishload', async () => {
        await restartWebflow();
      });
    }
  }

  await restartWebflow();
};
