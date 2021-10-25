import { importCMSCore } from '$utils/import';
import { isNotEmpty } from '@finsweet/ts-utils';
import { getCollectionListWrappers } from 'packages/cms/helpers';
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
  const collectionListWrappers = getCollectionListWrappers([getSelector('element', 'list', { operator: 'prefixed' })]);

  const listInstances = collectionListWrappers.map(cmsCore.createCMSListInstance).filter(isNotEmpty);

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
    await Promise.all(newItems.map((newItem) => populateNestedCollections(newItem, collectionsToNest, cmsCore)));
    await listInstance.emit('nestnewitems', newItems);
  });

  const { items } = listInstance;

  await Promise.all(items.map((item) => populateNestedCollections(item, collectionsToNest, cmsCore)));
  await listInstance.emit('nestexistingitems', items);
};
