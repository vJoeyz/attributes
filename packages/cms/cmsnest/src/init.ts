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

  // TODO: Make sure this is compatible with cmsfilter

  listInstance.on('additems', async (newItems) => {
    await Promise.all(newItems.map((newItem) => populateNestedCollections(newItem, collectionsToNest)));
  });

  await Promise.all(listInstance.items.map((item) => populateNestedCollections(item, collectionsToNest)));
};
