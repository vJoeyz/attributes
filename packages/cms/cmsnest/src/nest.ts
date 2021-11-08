import { ATTRIBUTES, getSelector } from './constants';
import { cloneNode, getCollectionElements, getCollectionListWrappers } from '@finsweet/ts-utils';
import { getNestingTargets } from './collect';

import type { CollectionItemElement } from '@finsweet/ts-utils';
import type { CMSItem } from '$cms/cmscore/src';
import type { CMSCore } from '$cms/cmscore/src/types';
import type { CollectionsToNest } from './types';

// Types

// Constants
const domParser = new DOMParser();

/**
 * Fetches each Collection Item's Template Page, checks which nested items belong to it, and appends the nested collection only containing the correspondent items.
 * @param cmsItem A `CMSItem` instance.
 * @param collectionsToNest The `CollectionsToNest` `Map`.
 */
export const populateNestedCollections = async (
  { element, href }: CMSItem,
  collectionsToNest: CollectionsToNest,
  { CMSList }: CMSCore
): Promise<void> => {
  if (!href) return;

  // Get the nesting targets
  const nestingTargets = getNestingTargets(element);
  if (!nestingTargets.size) return;

  // Fetch the `Collection Item`'s Template Page
  const response = await fetch(href);
  const rawPage = await response.text();
  const page = domParser.parseFromString(rawPage, 'text/html');

  // Get the existing lists to nest
  const pageCollectionListWrappers = getCollectionListWrappers([getSelector('collection')], page);

  // Populate the nested CMS lists only with the correspondent nested items
  for (const pageCollectionListWrapper of pageCollectionListWrappers) {
    const pageListInstance = new CMSList(pageCollectionListWrapper);

    const collectionId = pageListInstance.getAttribute(ATTRIBUTES.collection.key);
    if (!collectionId) continue;

    const collectionToNest = collectionsToNest.get(collectionId);
    const nestingTarget = nestingTargets.get(collectionId);
    if (!collectionToNest || !nestingTarget) continue;

    const nestingTargetParent = nestingTarget.parentElement;
    if (!nestingTargetParent) continue;

    const { listInstance, emptyElement } = collectionToNest;

    const itemsToNest = pageListInstance.items.reduce<CollectionItemElement[]>((items, { href }) => {
      if (!href) return items;

      const matchingItem = listInstance.items.find((item) => item.href && href === item.href);
      if (!matchingItem) return items;

      items.push(matchingItem.element);
      return items;
    }, []);

    if (!itemsToNest.length && !emptyElement) continue;

    const newCollectionWrapper = cloneNode(listInstance.wrapper);
    const newCollectionItems = getCollectionElements(newCollectionWrapper, 'items');

    if (itemsToNest.length) {
      for (const newCollectionItem of newCollectionItems) {
        const shouldBeNested = !!itemsToNest.find((itemToNest) => itemToNest.isEqualNode(newCollectionItem));

        if (!shouldBeNested) newCollectionItem.remove();
      }
    } else if (emptyElement) {
      const newCollectionList = getCollectionElements(newCollectionWrapper, 'list');
      newCollectionList?.remove();

      newCollectionWrapper.appendChild(cloneNode(emptyElement));
    }

    nestingTargetParent.insertBefore(newCollectionWrapper, nestingTarget);
    nestingTarget.remove();
  }
};
