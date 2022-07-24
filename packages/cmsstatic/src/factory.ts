import type { CMSList } from 'packages/cmscore/src';

import { ATTRIBUTES, queryElement } from './utils/constants';

export async function initStaticInstance(listInstance: CMSList) {
  const staticElements = [...queryElement<HTMLDivElement>('staticItem', { all: true })];

  for (const staticElement of staticElements) {
    const order = staticElement.getAttribute(ATTRIBUTES.order.key);

    if (!order) {
      continue;
    }

    const orderNumber = parseInt(order);

    if (isNaN(orderNumber)) {
      continue;
    }

    await listInstance.addStaticItems(staticElement, orderNumber);
  }
}
