import { getSelector } from './constants';
import { importCMSCore } from '$global/import/cmscore';
import { initListSorting } from './factory';

import type { CMSList } from '$cms/cmscore/src';

/**
 * Inits the attribute.
 */
export const init = async (): Promise<CMSList[]> => {
  const cmsCore = await importCMSCore();
  if (!cmsCore) return [];

  const listInstances = cmsCore.createCMSListInstances([getSelector('element', 'list', { operator: 'prefixed' })]);

  await Promise.all(listInstances.map(initListSorting));

  return listInstances;
};
