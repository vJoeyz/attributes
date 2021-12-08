import { restartWebflowModules } from './webflow';
import { wait } from '@finsweet/ts-utils';
import { CMSItem } from '.';

import type { CMSList } from '.';

/**
 * Defines: [The item to render, The index where to render it, The item to use as anchor]
 */
type AnchorData = [CMSItem, number, CMSItem | undefined];

/**
 * Shows / hides the list items based on their properties.
 * @param listInstance The {@link CMSList} instance.
 * @param addingItems Defines if new items are being added.
 * If yes, the items will be animated.
 * If not, the list will be animated instead.
 */
export const renderListItems = async (listInstance: CMSList, addingItems = false) => {
  const { items, itemsPerPage, paginationActive, currentPage, emptyState: oldEmptyState } = listInstance;

  // Collect items and recalculate the total pages
  const validItems: CMSItem[] = [];
  const itemsToHide: CMSItem[] = [];
  const itemsToShow: CMSItem[] = [];

  for (const item of items) {
    const { valid, currentIndex } = item;
    const rendered = typeof currentIndex === 'number';

    if (valid) {
      validItems.push(item);

      if (!paginationActive || !currentPage) {
        itemsToShow.push(item);
        continue;
      }

      const matchesCurrentPage =
        validItems.length > (currentPage - 1) * itemsPerPage && validItems.length <= currentPage * itemsPerPage;

      if (matchesCurrentPage) itemsToShow.push(item);
      else if (rendered) itemsToHide.push(item);
    } else if (rendered) itemsToHide.push(item);
  }

  // Set new properties
  listInstance.validItems = validItems;
  listInstance.totalPages = Math.ceil(validItems.length / itemsPerPage) || 1;

  const newEmptyState = !validItems.length;
  listInstance.emptyState = newEmptyState;

  // Prepare items to show
  const itemsToAnchor: AnchorData[] = [];

  itemsToShow.forEach((item, index) => {
    if (item.currentIndex !== index) itemsToAnchor.push([item, index, itemsToShow[index - 1]]);
  });

  // Animate the list
  const animateList = !addingItems || (oldEmptyState && !newEmptyState);

  if (animateList) await listInstance.displayElement(oldEmptyState ? 'emptyElement' : 'list', false);

  // Render the items
  await Promise.all([
    ...hideItems(itemsToHide, listInstance, addingItems),
    ...showItems(itemsToAnchor, listInstance, addingItems),
  ]);

  // Emit events
  await listInstance.emitSerial('renderitems', itemsToShow);

  // Restart Webflow Modules if needed
  await restartWebflowModules(itemsToShow, listInstance);

  // Animate the list
  if (animateList) await listInstance.displayElement(newEmptyState ? 'emptyElement' : 'list');
};

/**
 * Hides the items of a {@link CMSList}.
 *
 * @param itemsToHide An array of {@link CMSItem} to hide.
 * @param listInstance The `CMSList` instance.
 * @param animateItems Defines if the items should be animated when hiding them.
 * @returns An Array of promises.
 */
const hideItems = (itemsToHide: CMSItem[], { itemsAnimation }: CMSList, animateItems: boolean) => {
  return itemsToHide.map(async (item) => {
    const { element } = item;

    if (animateItems && itemsAnimation) {
      const { animateOut, options } = itemsAnimation;

      await animateOut(element, { remove: true, ...options });
    } else {
      element.remove();
    }

    item.currentIndex = undefined;
  });
};

/**
 * Shows the items of a {@link CMSList}.
 *
 * @param itemsToHide An array of {@link CMSItem} to show + the anchor `CMSItem` that precedes it.
 * This is used to define the exact spot where the `CMSItem` should be added in the list.
 * @param listInstance The `CMSList` instance.
 * @param animateItems Defines if the items should be animated when showing them.
 * @returns An Array of promises.
 */
const showItems = (itemsToAnchor: AnchorData[], { list, itemsAnimation }: CMSList, animateItems: boolean) => {
  if (!list) return [];

  return itemsToAnchor.map(async ([item, newIndex, anchor], actionIndex) => {
    item.animating = new Promise(async (resolveAnimating) => {
      item.rendering = new Promise(async (resolveRendering) => {
        await anchor?.rendering;

        const { element, currentIndex } = item;

        const anchorElement = anchor?.element || null;

        if (typeof currentIndex !== 'number' && animateItems && itemsAnimation) {
          const { prepareIn, animateIn, options } = itemsAnimation;
          const { stagger, ...animationOptions } = options || {};

          const settings = {
            target: list,
            insertAfter: anchorElement,
            ...animationOptions,
          };

          prepareIn(element, settings);
          resolveRendering();

          if (stagger) await wait(stagger * actionIndex);

          await animateIn(element, { ...settings, prepared: true });
        } else {
          if (anchorElement) list.insertBefore(element, anchorElement.nextSibling);
          else list.prepend(element);

          resolveRendering();
        }

        resolveAnimating();
      });
    });

    await item.rendering;

    item.currentIndex = newIndex;
  });
};
