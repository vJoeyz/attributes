import { CMS_ATTRIBUTE_ATTRIBUTE, CMS_NEST_ATTRIBUTE } from '$global/constants/attributes';
import { awaitAttributesLoad, finalizeAttribute } from '$global/factory';
import { importCMSCore } from '$global/import';
import type { CMSList } from '$packages/cmscore';

import { initListNesting } from './factory';
import { getSelector } from './utils/constants';

/**
 * Inits the attribute.
 */
export const init = async (): Promise<CMSList[]> => {
  const cmsCore = await importCMSCore();
  if (!cmsCore) return [];

  await awaitAttributesLoad(CMS_ATTRIBUTE_ATTRIBUTE);

  // Create the list instances
  const listInstances = cmsCore.createCMSListInstances([getSelector('element', 'list', { operator: 'prefixed' })]);

  await Promise.all(listInstances.map((listInstance) => initListNesting(listInstance, cmsCore)));

  return finalizeAttribute(CMS_NEST_ATTRIBUTE, listInstances, () => {
    for (const listInstance of listInstances) listInstance.destroy();
  });
};
