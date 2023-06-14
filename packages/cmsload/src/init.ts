import { createCMSListInstances } from '@finsweet/attributes-cmscore';
import { awaitWebflowReady, type FsAttributeInit } from '@finsweet/attributes-utils';

import { initLoadInstance } from './factory';
import { getElementSelector } from './utils/selectors';

/**
 * Inits the attribute.
 */
export const init: FsAttributeInit = async () => {
  await awaitWebflowReady();

  // Create the list instances
  const listInstances = createCMSListInstances([getElementSelector('list')]);

  // Init the modes
  const cleanups = await Promise.all(listInstances.map((listInstance) => initLoadInstance(listInstance)));

  return {
    result: listInstances,
    destroy() {
      for (const listInstance of listInstances) listInstance.destroy();
      for (const cleanup of cleanups) cleanup?.();
    },
  };
};
