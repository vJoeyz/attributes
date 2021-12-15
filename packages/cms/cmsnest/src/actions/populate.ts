import { cloneNode, getCollectionElements, getCollectionListWrappers } from '@finsweet/ts-utils';
import type { CollectionItemElement } from '@finsweet/ts-utils';

import type { CMSItem } from '$cms/cmscore/src';
import type { CMSCore } from '$cms/cmscore/src/types';
import { normalizePropKey } from '$cms/utils/props';

import { ATTRIBUTES, getSelector } from '../utils/constants';
import type { NestSources } from '../utils/types';
import { getNestTargets } from './collect';

// Constants
const domParser = new DOMParser();

/**
 * Fetches each Collection Item's Template Page, checks which nested items belong to it, and appends the nested collection only containing the correspondent items.
 * @param cmsItem A `CMSItem` instance.
 * @param nestSources The {@link NestSources} object.
 */
export const populateNestedCollections = async (
  { element, href }: CMSItem,
  nestSources: NestSources,
  { CMSList }: CMSCore
): Promise<void> => {
  if (!href) return;

  // Get the nest targets
  const nestTargets = getNestTargets(element);
  if (!nestTargets.size) return;

  // Fetch the `Collection Item`'s Template Page
  const response = await fetch(href);
  const rawPage = await response.text();
  const page = domParser.parseFromString(rawPage, 'text/html');

  // Get the existing lists to nest
  const pageCollectionListWrappers = getCollectionListWrappers([getSelector('collection')], page);

  // Populate the nested CMS lists only with the correspondent nested items
  pageCollectionListWrappers.forEach((pageCollectionListWrapper, index) => {
    const pageListInstance = new CMSList(pageCollectionListWrapper, index);

    const collectionId = normalizePropKey(pageListInstance.getAttribute(ATTRIBUTES.collection.key));
    if (!collectionId) return;

    const nestSource = nestSources.get(collectionId);
    const nestTarget = nestTargets.get(collectionId);
    if (!nestSource || !nestTarget) return;

    const nestTargetParent = nestTarget.parentElement;
    if (!nestTargetParent) return;

    const { listInstance, emptyElement } = nestSource;

    const itemsToNest = pageListInstance.items.reduce<CollectionItemElement[]>((items, { href }) => {
      if (!href) return items;

      const matchingItem = listInstance.items.find((item) => item.href && href === item.href);
      if (!matchingItem) return items;

      items.push(matchingItem.element);
      return items;
    }, []);

    if (!itemsToNest.length && !emptyElement) return;

    const newCollectionWrapper = cloneNode(listInstance.wrapper);
    const newCollectionItems = getCollectionElements(newCollectionWrapper, 'items');
    newCollectionWrapper.style.display = '';

    if (itemsToNest.length) {
      for (const newCollectionItem of newCollectionItems) {
        const shouldBeNested = !!itemsToNest.find((itemToNest) => itemToNest.isEqualNode(newCollectionItem));

        if (!shouldBeNested) newCollectionItem.remove();
      }
    } else if (emptyElement) {
      const newCollectionList = getCollectionElements(newCollectionWrapper, 'list');
      newCollectionList?.remove();

      const newEmptyElement = cloneNode(emptyElement);
      newEmptyElement.style.display = '';

      newCollectionWrapper.appendChild(newEmptyElement);
    }

    nestTargetParent.insertBefore(newCollectionWrapper, nestTarget);
    nestTarget.remove();
  });
};
