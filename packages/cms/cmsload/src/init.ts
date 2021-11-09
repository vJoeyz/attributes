import { getSelector } from './constants';
import { importCMSCore } from '$utils/import';
import { initLoadInstance } from './factory';

import type { CMSList } from '$cms/cmscore/src';

/**
 * Inits the attribute.
 */
export const init = async (): Promise<CMSList[]> => {
  const cmsCore = await importCMSCore();
  if (!cmsCore) return [];

  // Create the list instances
  const listInstances = cmsCore.createCMSListInstances([getSelector('element', 'list', { operator: 'prefixed' })]);

  // Init the modes
  await Promise.all(listInstances.map(initLoadInstance));

  return listInstances;
};
