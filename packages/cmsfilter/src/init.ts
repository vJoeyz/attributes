import { type CMSList, createCMSListInstances } from '@finsweet/attributes-cmscore';
import { awaitAttributeLoaded, awaitWebflowReady, type FsAttributeInit } from '@finsweet/attributes-utils';
import { isNotEmpty } from '@finsweet/ts-utils';

import { listenListEvents } from './actions/events';
import { createCMSFiltersInstance, createCMSTagsInstance } from './factory';
import { getElementSelector } from './utils/selectors';

/**
 * Inits the attribute.
 */
export const init: FsAttributeInit = async () => {
  await awaitWebflowReady();
  await awaitAttributeLoaded('queryparam');

  const listInstances = createCMSListInstances([getElementSelector('list')]);

  const filtersData = (await Promise.all(listInstances.map((listInstance) => initFilters(listInstance)))).filter(
    isNotEmpty
  );

  const filtersInstances = filtersData.map(({ filtersInstance }) => filtersInstance);

  return {
    result: filtersInstances,
    destroy() {
      for (const listInstance of listInstances) listInstance.destroy();
      for (const { cleanup } of filtersData) cleanup();
    },
  };
};

/**
 * Creates a new {@link CMSFilters} instance for each {@link CMSList}.
 * @param listInstance The `CMSList` instance.
 */
const initFilters = async (listInstance: CMSList) => {
  // Filters
  const filtersInstance = createCMSFiltersInstance(listInstance);
  if (!filtersInstance) return;

  listenListEvents(filtersInstance, listInstance);

  // Tags
  const tagsInstance = await createCMSTagsInstance(listInstance, filtersInstance);

  return {
    filtersInstance,
    cleanup: () => {
      filtersInstance.destroy();
      tagsInstance?.destroy();
    },
  };
};
