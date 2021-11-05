import { getSelector } from './constants';
import { importCMSCore } from '$utils/import';
import { collectCombineData } from './collect';
import { combineItemsToTarget } from './combine';

import type { CMSList } from '$cms/cmscore/src';
import type { CombineData } from './types';

/**
 * Inits the attribute.
 */
export const init = async (): Promise<CMSList[]> => {
  const cmsCore = await importCMSCore();
  if (!cmsCore) return [];

  const listInstances = cmsCore.createCMSListInstances([
    getSelector('element', 'list', { operator: 'prefixed' }),
    getSelector('element', 'target', { operator: 'prefixed' }),
  ]);

  const populateData = collectCombineData(listInstances);

  // Combine the lists
  const combineLists = await Promise.all(populateData.map(initListsCombine));

  return combineLists;
};

/**
 * Combines the existing items from the source lists to the target list.
 * Listens for `additems` events on the source lists to combine those new items too.
 * @param combineData The {@link CombineData} array.
 * @returns The target {@link CMSList} instance.
 */
const initListsCombine = async ({ lists, target }: CombineData) => {
  // Listen events
  for (const listInstance of lists) {
    listInstance.on('additems', async (newItems) => await combineItemsToTarget(target, newItems));
  }

  // Combine items
  for (const { wrapper, items } of lists) {
    wrapper.remove();

    await combineItemsToTarget(target, items);
  }

  return target;
};
