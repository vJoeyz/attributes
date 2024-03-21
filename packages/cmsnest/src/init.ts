import { createCMSListInstances } from '@finsweet/attributes-cmscore';
import { type FsAttributeInit, waitWebflowReady } from '@finsweet/attributes-utils';

import { initListNesting } from './factory';
import { getElementSelector } from './utils/selectors';

/**
 * Inits the attribute.
 */
export const init: FsAttributeInit = async () => {
  await waitWebflowReady();

  // Create the list instances
  const listInstances = createCMSListInstances([getElementSelector('list')]);

  await Promise.all(listInstances.map(initListNesting));

  return {
    result: listInstances,
    destroy() {
      for (const listInstance of listInstances) listInstance.destroy();
    },
  };
};
