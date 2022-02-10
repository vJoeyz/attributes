import type { CMSList } from '$cms/cmscore/src';
import { importCMSCore } from '$global/import/cmscore';

import { initListNesting } from './factory';
import { ATTRIBUTE, getSelector } from './utils/constants';

/**
 * Inits the attribute.
 */
export const init = async (): Promise<CMSList[]> => {
  const cmsCore = await importCMSCore();
  if (!cmsCore) return [];

  // Create the list instances
  const listInstances = cmsCore.createCMSListInstances([getSelector('element', 'list', { operator: 'prefixed' })]);

  for (const listInstance of listInstances) initListNesting(listInstance, cmsCore);

  await Promise.all(listInstances.map((listInstance) => initListNesting(listInstance, cmsCore)));

  window.fsAttributes[ATTRIBUTE].resolve?.(listInstances);

  return listInstances;
};
