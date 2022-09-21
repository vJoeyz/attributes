import type { CMSList } from 'packages/cmscore/src';

import { ATTRIBUTES, queryElement } from './utils/constants';

export async function initStaticInstance(listInstance: CMSList) {
  const instanceIndex = listInstance.getInstanceIndex(ATTRIBUTES.element.key);

  const staticElements = [...queryElement<HTMLDivElement>('staticItem', { all: true, instanceIndex })];

  const staticElementsData = staticElements.reduce<Parameters<CMSList['addStaticItems']>['0']>((acc, itemElement) => {
    const order = itemElement.getAttribute(ATTRIBUTES.order.key);

    const interactive = itemElement.getAttribute(ATTRIBUTES.interactive.key) === ATTRIBUTES.interactive.values.true;

    if (!order) {
      return acc;
    }

    const targetIndex = parseInt(order) - 1;

    if (isNaN(targetIndex)) {
      return acc;
    }

    acc.push({
      itemElement,
      interactive,
      targetIndex,
    });

    return acc;
  }, []);

  await listInstance.addStaticItems(staticElementsData);
}
