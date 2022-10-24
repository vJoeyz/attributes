import { CMS_ATTRIBUTE_ATTRIBUTE, CMS_SORT_ATTRIBUTE } from '$global/constants/attributes';
import { importCMSCore } from '$global/import';
import type { CMSList } from '$packages/cmscore';

import { initListSorting } from './factory';
import { getSelector } from './utils/constants';

/**
 * Inits the attribute.
 */
export const init = async (): Promise<CMSList[]> => {
  const cmsCore = await importCMSCore();
  if (!cmsCore) return [];

  await window.fsAttributes[CMS_ATTRIBUTE_ATTRIBUTE]?.loading;

  const listInstances = cmsCore.createCMSListInstances([getSelector('element', 'list', { operator: 'prefixed' })]);

  await Promise.all(listInstances.map((listInstance) => initListSorting(listInstance, cmsCore)));

  window.fsAttributes[CMS_SORT_ATTRIBUTE].resolve?.(listInstances);

  return listInstances;
};
