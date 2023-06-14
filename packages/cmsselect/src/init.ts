import type { CMSList } from '@finsweet/attributes-cmscore';
import { awaitAttributeLoaded, awaitWebflowReady, type FsAttributeInit } from '@finsweet/attributes-utils';
import { isHTMLSelectElement } from '@finsweet/ts-utils';

import { populateSelectElement } from './actions/populate';
import { queryAllElements } from './utils/selectors';

/**
 * Inits the attribute.
 */
export const init: FsAttributeInit = async () => {
  await awaitWebflowReady();

  const targetElements = queryAllElements('select');

  const listInstancesSet: Set<CMSList> = new Set();

  for (const targetElement of targetElements) {
    if (!isHTMLSelectElement(targetElement)) continue;

    const selectElementListInstances = populateSelectElement(targetElement);

    for (const listIntance of selectElementListInstances) {
      listInstancesSet.add(listIntance);
    }
  }

  const listInstances = [...listInstancesSet];

  await awaitAttributeLoaded('cmsload');

  return {
    result: listInstances,
    destroy() {
      for (const listInstance of listInstances) listInstance.destroy();
    },
  };
};
