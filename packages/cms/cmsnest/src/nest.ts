import { getCollectionListWrappers } from 'packages/cms/helpers';
import { ATTRIBUTES, getSelector } from './constants';
import { CMSItem, createCMSListInstance } from 'packages/cms/CMSList';
import { CMSList } from 'packages/cms/CMSList';
import { cloneNode, getCollectionElements } from '@finsweet/ts-utils';

import type { CollectionItemElement } from '@finsweet/ts-utils';

// Types
type CollectionsToNest = Map<string, CMSList>;
type NestingTargets = Map<string, HTMLElement>;

// Constants
const {
  list: { key: listKey },
} = ATTRIBUTES;

const domParser = new DOMParser();

/**
 * Queries the existing CMS Collections on the page that will be nested inside the main list instance.
 * @returns A `Map` with the `collectionKey` as the keys and `CMSList` instances as the values.
 */
export const getCollectionsToNest = (): CollectionsToNest => {
  const collectionsToNest: CollectionsToNest = new Map();
  const collectionListWrappers = getCollectionListWrappers([getSelector('list')]);

  for (const collectionListWrapper of collectionListWrappers) {
    const listInstance = createCMSListInstance(collectionListWrapper);
    if (!listInstance) continue;

    const collectionKey = listInstance.getAttribute(listKey);
    if (!collectionKey) continue;

    collectionListWrapper.remove();

    collectionsToNest.set(collectionKey, listInstance);
  }

  return collectionsToNest;
};

/**
 * Fetches each Collection Item's Template Page, checks which nested items belong to it, and appends the nested collection only containing the correspondent items.
 * @param cmsItem A `CMSItem` instance.
 * @param collectionsToNest The `CollectionsToNest` `Map`.
 */
export const populateNestedCollections = async (
  { element, href }: CMSItem,
  collectionsToNest: CollectionsToNest
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
  const pageCollectionListWrappers = getCollectionListWrappers([getSelector('list')], page);

  // Populate the nested CMS lists only with the correspondent nested items
  for (const pageCollectionListWrapper of pageCollectionListWrappers) {
    const pageListInstance = new CMSList(pageCollectionListWrapper);

    const collectionKey = pageListInstance.getAttribute(listKey);
    if (!collectionKey) continue;

    const collectionToNest = collectionsToNest.get(collectionKey);
    const nestingTarget = nestingTargets.get(collectionKey);
    if (!collectionToNest || !nestingTarget) continue;

    const nestingTargetParent = nestingTarget.parentElement;
    if (!nestingTargetParent) continue;

    const collectionEmptyElement = getCollectionElements(pageCollectionListWrapper, 'empty');

    const itemsToNest = pageListInstance.items.reduce<CollectionItemElement[]>((items, { href }) => {
      if (!href) return items;

      const matchingItem = collectionToNest.items.find((item) => item.href && href === item.href);
      if (!matchingItem) return items;

      items.push(matchingItem.element);
      return items;
    }, []);

    if (!itemsToNest.length && !collectionEmptyElement) continue;

    const newCollectionWrapper = cloneNode(collectionToNest.wrapper);
    const newCollectionItems = getCollectionElements(newCollectionWrapper, 'items');

    if (itemsToNest.length) {
      for (const newCollectionItem of newCollectionItems) {
        const shouldBeNested = !!itemsToNest.find((itemToNest) => itemToNest.isEqualNode(newCollectionItem));

        if (!shouldBeNested) newCollectionItem.remove();
      }
    } else if (collectionEmptyElement) {
      const newCollectionList = getCollectionElements(newCollectionWrapper, 'list');
      newCollectionList?.remove();

      newCollectionWrapper.appendChild(collectionEmptyElement);
    }

    nestingTargetParent.insertBefore(newCollectionWrapper, nestingTarget);
    nestingTarget.remove();
  }
};

/**
 * Queries the target elements where the nested CMS Collections will be appended.
 * @param itemElement The `CollectionItemElement`.
 * @returns A `Map` with the `collectionKey` as the keys and `HTMLElement` targets as the values.
 */
const getNestingTargets = (itemElement: CollectionItemElement) => {
  const nestingTargets: NestingTargets = new Map();
  const nestingTargetElements = itemElement.querySelectorAll<HTMLElement>(getSelector('list'));

  for (const target of nestingTargetElements) {
    const collectionKey = target.getAttribute(listKey);
    if (!collectionKey) continue;

    nestingTargets.set(collectionKey, target);
  }

  return nestingTargets;
};
