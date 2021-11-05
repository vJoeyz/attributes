import { ATTRIBUTES, getSelector } from './constants';

import type { CollectionItemElement } from '@finsweet/ts-utils';
import type { CollectionsToNest, NestingTargets } from './types';
import type { CMSCore } from '$cms/cmscore/src/types';

// Constants
const {
  list: { key: listKey },
  empty: { key: emptyKey },
} = ATTRIBUTES;

/**
 * Queries the existing CMS Collections on the page that will be nested inside the main list instance.
 * @returns A `Map` with the `collectionKey` as the keys and `CMSList` instances as the values.
 */
export const getCollectionsToNest = ({ createCMSListInstances }: CMSCore): CollectionsToNest => {
  const collectionsToNest: CollectionsToNest = new Map();

  const listInstances = createCMSListInstances([getSelector('list')]);

  for (const listInstance of listInstances) {
    const collectionKey = listInstance.getAttribute(listKey);
    if (!collectionKey) continue;

    const emptyElement = document.querySelector<HTMLElement>(`[${emptyKey}^="${collectionKey}"]`);
    if (emptyElement) emptyElement.remove();

    listInstance.wrapper.remove();

    collectionsToNest.set(collectionKey, { listInstance, emptyElement });
  }

  return collectionsToNest;
};

/**
 * Queries the target elements where the nested CMS Collections will be appended.
 * @param itemElement The `CollectionItemElement`.
 * @returns A `Map` with the `collectionKey` as the keys and `HTMLElement` targets as the values.
 */
export const getNestingTargets = (itemElement: CollectionItemElement) => {
  const nestingTargets: NestingTargets = new Map();
  const nestingTargetElements = itemElement.querySelectorAll<HTMLElement>(getSelector('list'));

  for (const target of nestingTargetElements) {
    const collectionKey = target.getAttribute(listKey);
    if (!collectionKey) continue;

    nestingTargets.set(collectionKey, target);
  }

  return nestingTargets;
};
