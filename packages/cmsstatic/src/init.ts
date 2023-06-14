import { createCMSListInstances } from '@finsweet/attributes-cmscore';
import { awaitWebflowReady, type FsAttributeInit } from '@finsweet/attributes-utils';

import { initStaticInstance } from './factory';
import { getElementSelector } from './utils/selectors';

/**
 * Inits the attribute.
 */
export const init: FsAttributeInit = async () => {
  await awaitWebflowReady();

  // Create the list instances
  const listInstances = createCMSListInstances([getElementSelector('list')]);

  // Init the modes
  await Promise.all(listInstances.map(initStaticInstance));

  return {
    result: listInstances,
    destroy() {
      for (const listInstance of listInstances) listInstance.destroy();
    },
  };
};
