import { Debug } from '@finsweet/ts-utils';
import { importCMSCore } from '$utils/import';
import { getSelector } from './constants';
import { populateNestedCollections } from './nest';
import { getCollectionsToNest } from './collect';

import type { CMSList } from '$cms/cmscore/src';
import type { CMSCore } from '$cms/cmscore/src/types';

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

  return listInstances;
};

/**
 * Inits the nesting.
 * @param listInstance
 * @param cmsCore
 */
const initListNesting = async (listInstance: CMSList, cmsCore: CMSCore): Promise<void> => {
  const collectionsToNest = getCollectionsToNest(cmsCore);
  if (!collectionsToNest.size) {
    Debug.alert(`No collections to nest found for the list nº ${listInstance.index}`, 'info');
    return;
  }

  listInstance.on('shouldnest', async (newItems) => {
    await Promise.all(newItems.map((newItem) => populateNestedCollections(newItem, collectionsToNest, cmsCore)));
  });

  const existingItems = [...listInstance.items];

  await Promise.all(existingItems.map((item) => populateNestedCollections(item, collectionsToNest, cmsCore)));
  await listInstance.emitSerial('nestinitialitems', existingItems);
};
