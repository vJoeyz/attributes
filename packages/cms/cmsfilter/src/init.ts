import { createCMSFiltersInstance, createCMSTagsInstance } from './factory';
import { listenListEvents } from './actions/events';
import { getSelector } from './utils/constants';
import { isNotEmpty } from '@finsweet/ts-utils';
import { importCMSCore } from 'global/import';
import { CMSFilters } from './components/CMSFilters';

import type { CMSList } from '$cms/cmscore/src';

/**
 * Inits the attribute.
 */
export const init = async (): Promise<CMSFilters[]> => {
  const cmsCore = await importCMSCore();
  if (!cmsCore) return [];

  const listInstances = cmsCore.createCMSListInstances([getSelector('element', 'list', { operator: 'prefixed' })]);

  const filtersInstances = (await Promise.all(listInstances.map(initFilters))).filter(isNotEmpty);

  return filtersInstances;
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
  await createCMSTagsInstance(listInstance, filtersInstance);

  return filtersInstance;
};
