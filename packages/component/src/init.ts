import { CMS_ATTRIBUTE_ATTRIBUTE, COMPONENT_ATTRIBUTE } from '$global/constants/attributes';
import { awaitAttributesLoad, finalizeAttribute } from '$global/factory';

import { collectComponentTargetsData } from './actions/collect';
import { prefetchComponentsPages } from './actions/prefetch';
import { initComponents } from './factory';

/**
 * Inits the attribute.
 */
export const init = async ({
  proxy,
  cacheKey,
  cacheVersion,
}: {
  proxy?: string | null;
  cacheKey?: string | null;
  cacheVersion?: string | number | null;
} = {}) => {
  await awaitAttributesLoad(CMS_ATTRIBUTE_ATTRIBUTE);

  const componentTargetsData = collectComponentTargetsData(proxy);

  await prefetchComponentsPages(componentTargetsData, cacheKey, cacheVersion);

  const componentsData = await initComponents(componentTargetsData);

  return finalizeAttribute(COMPONENT_ATTRIBUTE, componentsData);
};
