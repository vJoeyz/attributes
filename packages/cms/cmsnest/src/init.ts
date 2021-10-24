import { isNotEmpty } from '@finsweet/ts-utils';
import { createCMSListInstance } from 'packages/cms/CMSList';
import { getCollectionListWrappers } from 'packages/cms/helpers';
import { ATTRIBUTES, getSelector } from './constants';
import { getCollectionsToNest, populateNestedCollections } from './nest';

import type { CMSList } from 'packages/cms/CMSList';

// Types
interface Params {
  listsSelector?: string;
}

/**
 * Inits the attribute.
 *
 * Auto init:
 * @param params The current `<script>` element.
 *
 * Programatic init:
 * @param params.param A global parameter.
 */
export const init = (params?: HTMLOrSVGScriptElement | Params | null): void => {
  let globalListsSelector: string | null | undefined;

  if (params instanceof HTMLScriptElement || params instanceof SVGScriptElement) {
    globalListsSelector = params.getAttribute(ATTRIBUTES.lists.key);
  } else if (params) globalListsSelector = params.listsSelector;

  // Create the list instances
  const collectionListWrappers = getCollectionListWrappers([
    getSelector('element', 'list', { operator: 'prefixed' }),
    globalListsSelector,
  ]);

  const listInstances = collectionListWrappers.map(createCMSListInstance).filter(isNotEmpty);

  for (const listInstance of listInstances) initListNesting(listInstance);
};

const initListNesting = async (listInstance: CMSList): Promise<void> => {
  const collectionsToNest = getCollectionsToNest();
  if (!collectionsToNest.size) return;

  listInstance.on('beforeadditems', async (newItems) => {
    await Promise.all(newItems.map((newItem) => populateNestedCollections(newItem, collectionsToNest)));
    await listInstance.emit('nestnewitems', newItems);
  });

  const { items } = listInstance;

  await Promise.all(items.map((item) => populateNestedCollections(item, collectionsToNest)));
  await listInstance.emit('nestexistingitems', items);
};
