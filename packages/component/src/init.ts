import { awaitWebflowReady, type FsAttributeInit } from '@finsweet/attributes-utils';

import { collectComponentTargetsData } from './actions/collect';
import { prefetchComponentsPages } from './actions/prefetch';
import { initComponents } from './factory';
import type { SETTINGS } from './utils/constants';

/**
 * Inits the attribute.
 */
export const init: FsAttributeInit<typeof SETTINGS> = async ({ proxy, cachekey, cacheversion } = {}) => {
  await awaitWebflowReady();

  const componentTargetsData = collectComponentTargetsData(proxy);

  await prefetchComponentsPages(componentTargetsData, cachekey, cacheversion);

  const componentsData = await initComponents(componentTargetsData);

  return {
    result: componentsData,
  };
};
