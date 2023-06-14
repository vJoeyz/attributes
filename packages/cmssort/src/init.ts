import { createCMSListInstances } from '@finsweet/attributes-cmscore';
import { awaitWebflowReady, type FsAttributeInit } from '@finsweet/attributes-utils';
import { isNotEmpty } from '@finsweet/ts-utils';

import { initListSorting } from './factory';
import { getElementSelector } from './utils/selectors';

/**
 * Inits the attribute.
 */
export const init: FsAttributeInit = async () => {
  await awaitWebflowReady();

  const listInstances = createCMSListInstances([getElementSelector('list')]);

  const cleanups = (await Promise.all(listInstances.map((listInstance) => initListSorting(listInstance)))).filter(
    isNotEmpty
  );

  return {
    result: listInstances,
    destroy() {
      for (const listInstance of listInstances) listInstance.destroy();
      for (const cleanup of cleanups) cleanup();
    },
  };
};
