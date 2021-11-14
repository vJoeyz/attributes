import { getSelector } from './constants';
import { importCMSCore } from '$utils/import';
import { addCSSClasses } from './classes';

import type { CMSList } from '$cms/cmscore/src';

/**
 * Inits the attribute.
 */
export const init = async (): Promise<CMSList[]> => {
  const cmsCore = await importCMSCore();
  if (!cmsCore) return [];

  const listInstances = cmsCore.createCMSListInstances([getSelector('element', 'list', { operator: 'prefixed' })]);

  // Combine the lists
  await Promise.all(listInstances.map(initListsCSS));

  return listInstances;
};

/**
 * Inits dynamically adding CSS classes to the Collection Items of the lists.
 */
const initListsCSS = async (listInstance: CMSList) => {
  const { items } = listInstance;

  addCSSClasses(items);

  listInstance.on('renderitems', (renderedItems) => addCSSClasses(renderedItems));
};
