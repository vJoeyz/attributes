import type { CMSList } from '$cms/cmscore/src';
import { importCMSCore } from '$global/import/cmscore';

import { getSelector } from './constants';
import { initListSorting } from './factory';

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
