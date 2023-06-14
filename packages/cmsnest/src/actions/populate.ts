import { CMSItem, CMSList } from '@finsweet/attributes-cmscore';
import { fetchPageDocument, normalizePropKey } from '@finsweet/attributes-utils';
import { cloneNode, getCollectionElements, getCollectionListWrappers } from '@finsweet/ts-utils';

import { getAttribute, getSettingSelector } from '../utils/selectors';
import type { ExternalNestTargets, ManualNestTargets, NestSource, NestSources } from '../utils/types';
import { getNestTargets } from './collect';

/**
 * Fetches each Collection Item's Template Page, checks which nested items belong to it, and appends the nested collection only containing the correspondent items.
 * @param item A `CMSItem` instance.
 * @param nestSources The {@link NestSources} object.
 * @param cache Whether to cache the fetched pages or not.
 */
export const populateNestedCollections = async (
  item: CMSItem,
  nestSources: NestSources,
  cache: boolean
): Promise<void> => {
  // Get the nest targets
  const { manualNestTargets, externalNestTargets } = getNestTargets(item.element);

  // Perform nesting
  await Promise.all([
    nestManualItems(manualNestTargets, nestSources, cache),
    nestExternalItems(externalNestTargets, item, nestSources, cache),
  ]);
};

/**
 * Nests all the items that have been defined manually as a comma-separated list in the target element.
 * @param manualNestTargets
 * @param nestSources
 * @param cache
 *
 * @returns A Promise that fulfills when all nesting and recursive nestings finish.
 */
const nestManualItems = (manualNestTargets: ManualNestTargets, nestSources: NestSources, cache: boolean) => {
  return Promise.all(
    [...manualNestTargets].map(([collectionId, { nestTarget, slugs }]) => {
      const nestSource = nestSources.get(collectionId);
      if (!nestSource) return;

      // Get the items to nest
      const itemsToNest = nestSource.listInstance.items.filter(({ href }) => {
        if (!href) return false;

        try {
          const url = new URL(href);
          const [slug] = url.pathname.match(/[^/]+(?=\/$|$)/g) || [];

          return slug && slugs.includes(slug);
        } catch (err) {
          return false;
        }
      });

      return nestItems(nestTarget, itemsToNest, nestSource, nestSources, cache);
    })
  );
};

/**
 * Nests all the items that require fetching the template page.
 * @param externalNestTargets
 * @param item
 * @param nestSources
 *
 * @returns A Promise that fulfills when all nesting and recursive nestings finish.
 */
const nestExternalItems = async (
  externalNestTargets: ExternalNestTargets,
  item: CMSItem,
  nestSources: NestSources,
  cache: boolean
) => {
  if (!externalNestTargets.size || !item.href) return;

  // Fetch the Collection Item's Template Page
  const page = await fetchPageDocument(item.href, { cache });
  if (!page) return;

  // Get the existing lists to nest
  const pageCollectionListWrappers = getCollectionListWrappers([getSettingSelector('collection')], page);

  // Populate the nested CMS lists only with the correspondent nested items
  // Also, make sure that the Collections in the Template Page are not duplicated
  const processedPageCollections: Set<string> = new Set();

  await Promise.all(
    pageCollectionListWrappers.map(async (pageCollectionListWrapper, index) => {
      const pageListInstance = new CMSList(pageCollectionListWrapper, index);

      const rawCollectionId = getAttribute(pageListInstance.listOrWrapper, 'collection');
      const collectionId = normalizePropKey(rawCollectionId);

      if (!collectionId || processedPageCollections.has(collectionId)) return;

      processedPageCollections.add(collectionId);

      const nestSource = nestSources.get(collectionId);
      const nestTarget = externalNestTargets.get(collectionId);
      if (!nestSource || !nestTarget) return;

      // Get the items to nest
      const itemsToNest = pageListInstance.items.reduce<CMSItem[]>((items, { href }) => {
        if (!href) return items;

        const matchingItem = nestSource.listInstance.items.find((item) => item.href && href === item.href);
        if (!matchingItem) return items;

        items.push(matchingItem);
        return items;
      }, []);

      await nestItems(nestTarget, itemsToNest, nestSource, nestSources, cache);
    })
  );
};

/**
 * Nests a set of items into a target.
 * Performs recursive nesting.
 * @param nestTarget
 * @param itemsToNest
 * @param nestSource
 * @param nestSources
 * @param cache
 *
 * @returns A Promise that fulfills when all nesting and recursive nestings finish.
 */
const nestItems = async (
  nestTarget: HTMLElement,
  itemsToNest: CMSItem[],
  { listInstance, emptyElement }: NestSource,
  nestSources: NestSources,
  cache: boolean
) => {
  if (!itemsToNest.length && !emptyElement) return;

  const nestTargetParent = nestTarget.parentElement;
  if (!nestTargetParent) return;

  // Create the new collection to nest
  const newCollectionWrapper = cloneNode(listInstance.wrapper);
  const newCollectionItems = getCollectionElements(newCollectionWrapper, 'items');
  newCollectionWrapper.style.display = '';

  // Populate items
  if (itemsToNest.length) {
    await Promise.all(
      [...newCollectionItems].map((newCollectionItem) => {
        const shouldBeNested = !!itemsToNest.find(({ element }) => element.isEqualNode(newCollectionItem));

        if (!shouldBeNested) {
          newCollectionItem.remove();
          return;
        }

        // Recursive populate the new nested item
        const item = new CMSItem(newCollectionItem, newCollectionWrapper);
        return populateNestedCollections(item, nestSources, cache);
      })
    );
  }

  // Or show the empty element
  else if (emptyElement) {
    const newCollectionList = getCollectionElements(newCollectionWrapper, 'list');
    newCollectionList?.remove();

    const newEmptyElement = cloneNode(emptyElement);
    newEmptyElement.style.display = '';

    newCollectionWrapper.appendChild(newEmptyElement);
  }

  // Append the collection and remove the placeholder
  nestTargetParent.insertBefore(newCollectionWrapper, nestTarget);
  nestTarget.remove();
};
