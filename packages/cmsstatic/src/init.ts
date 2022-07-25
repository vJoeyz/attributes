import type { CMSList } from '@finsweet/attributes-cmscore';
import { importCMSCore } from '@finsweet/attributes-cmscore';
import {
  CMS_STATIC_ATTRIBUTE,
  CMS_LOAD_ATTRIBUTE,
  CMS_FILTER_ATTRIBUTE,
  CMS_NEST_ATTRIBUTE,
  CMS_SORT_ATTRIBUTE,
  CMS_COMBINE_ATTRIBUTE,
} from 'global/constants/attributes';

import { initStaticInstance } from './factory';
import { getSelector } from './utils/constants';

/**
 * Inits the attribute.
 */
export const init = async (): Promise<CMSList[]> => {
  const cmsCore = await importCMSCore();
  if (!cmsCore) return [];

  const data = await Promise.all([
    await window.fsAttributes[CMS_LOAD_ATTRIBUTE]?.loading,
    await window.fsAttributes[CMS_FILTER_ATTRIBUTE]?.loading,
    await window.fsAttributes[CMS_NEST_ATTRIBUTE]?.loading,
    await window.fsAttributes[CMS_SORT_ATTRIBUTE]?.loading,
    await window.fsAttributes[CMS_COMBINE_ATTRIBUTE]?.loading,
  ]);
  console.log(data);

  // Create the list instances
  const listInstances = cmsCore.createCMSListInstances([getSelector('element', 'list', { operator: 'prefixed' })]);

  // Init the modes
  await Promise.all(listInstances.map(initStaticInstance));

  window.fsAttributes[CMS_STATIC_ATTRIBUTE].resolve?.(listInstances);

  return listInstances;
};
