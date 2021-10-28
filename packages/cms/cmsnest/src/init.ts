import { importCMSCore } from '$utils/import';
import { getSelector } from './constants';
import { getCollectionsToNest, populateNestedCollections } from './nest';

import type { CMSList } from 'packages/cms/cmscore/src';
import type { CMSCore } from 'packages/cms/cmscore/src/types';

/**
 * Inits the attribute.
 */
export const init = async (): Promise<void> => {
  const cmsCore = await importCMSCore();
  if (!cmsCore) return;

  // Create the list instances
  const listInstances = cmsCore.createCMSListInstances([getSelector('element', 'list', { operator: 'prefixed' })]);

  for (const listInstance of listInstances) initListNesting(listInstance, cmsCore);
};

/**
 * Inits the nesting.
 * @param listInstance
 * @param cmsCore
 */
const initListNesting = async (listInstance: CMSList, cmsCore: CMSCore): Promise<void> => {
  const collectionsToNest = getCollectionsToNest(cmsCore);
  if (!collectionsToNest.size) return;

  listInstance.on('beforeadditems', async (newItems) => {
    console.log('before adding items');
    await Promise.all(newItems.map((newItem) => populateNestedCollections(newItem, collectionsToNest, cmsCore)));
    await listInstance.emitSerial('nestnewitems', newItems);
  });

  const existingItems = [...listInstance.items];

  await Promise.all(existingItems.map((item) => populateNestedCollections(item, collectionsToNest, cmsCore)));
  await listInstance.emitSerial('nestinitialitems', existingItems);
};
