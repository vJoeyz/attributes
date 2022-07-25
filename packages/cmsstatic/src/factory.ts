import type { CMSList } from 'packages/cmscore/src';

import { ATTRIBUTES, queryElement } from './utils/constants';

export async function initStaticInstance(listInstance: CMSList) {
  const instanceIndex = listInstance.getInstanceIndex(ATTRIBUTES.element.key);

  const staticElements = [...queryElement<HTMLDivElement>('staticItem', { all: true, instanceIndex })];

  console.log(staticElements);
  for (const staticElement of staticElements) {
    const order = staticElement.getAttribute(ATTRIBUTES.order.key);
    const interactive = staticElement.getAttribute(ATTRIBUTES.interactive.key);

    if (!order) {
      continue;
    }

    const orderNumber = parseInt(order);

    if (isNaN(orderNumber)) {
      continue;
    }

    await listInstance.addStaticItems(staticElement, orderNumber, !!interactive);
  }
}
