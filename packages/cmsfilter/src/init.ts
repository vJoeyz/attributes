import { isNotEmpty } from '@finsweet/ts-utils';

import { QUERY_PARAM_ATTRIBUTE, CMS_FILTER_ATTRIBUTE, CMS_ATTRIBUTE_ATTRIBUTE } from '$global/constants/attributes';
import { importCMSCore } from '$global/import';
import type { CMSCore, CMSList } from '$packages/cmscore';

import { listenListEvents } from './actions/events';
import type { CMSFilters } from './components/CMSFilters';
import { createCMSFiltersInstance, createCMSTagsInstance } from './factory';
import { getSelector } from './utils/constants';

/**
 * Inits the attribute.
 */
export const init = async (): Promise<CMSFilters[]> => {
  const cmsCore = await importCMSCore();
  if (!cmsCore) return [];

  await window.fsAttributes[CMS_ATTRIBUTE_ATTRIBUTE]?.loading;
  await window.fsAttributes[QUERY_PARAM_ATTRIBUTE]?.loading;

  const listInstances = cmsCore.createCMSListInstances([getSelector('element', 'list', { operator: 'prefixed' })]);

  const filtersInstances = (
    await Promise.all(listInstances.map((listInstance) => initFilters(listInstance, cmsCore)))
  ).filter(isNotEmpty);

  window.fsAttributes[CMS_FILTER_ATTRIBUTE].resolve?.(filtersInstances);

  return filtersInstances;
};

/**
 * Creates a new {@link CMSFilters} instance for each {@link CMSList}.
 * @param listInstance The `CMSList` instance.
 */
const initFilters = async (listInstance: CMSList, cmsCore: CMSCore) => {
  // Filters
  const filtersInstance = createCMSFiltersInstance(listInstance, cmsCore);
  if (!filtersInstance) return;

  listenListEvents(filtersInstance, listInstance);

  // Tags
  await createCMSTagsInstance(listInstance, filtersInstance);

  return filtersInstance;
};
