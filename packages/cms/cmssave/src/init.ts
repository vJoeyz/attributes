import type { CMSList } from '$cms/cmscore/src';
import { importCMSCore } from '$global/import/cmscore';

import { initSaveSourceInstance } from './factory';
import { getSelector } from './utils/constants';

/**
 * Inits the attribute.
 */
export const init = async (): Promise<CMSList[]> => {
  const cmsCore = await importCMSCore();
  if (!cmsCore) return [];

  // Create the list instances
  const sourceListInstances = cmsCore.createCMSListInstances([
    getSelector('element', 'list', { operator: 'prefixed' }),
  ]);

  const targetListInstances = cmsCore.createCMSListInstances([getSelector('collection')]);

  // Init the modes
  await Promise.all(sourceListInstances.map(initSaveSourceInstance));

  return sourceListInstances;
};
