import { restartWebflow, wait } from '@finsweet/ts-utils';
import { CMSItem } from '.';

import type { CMSList } from '.';
import type { WebflowModule } from '@finsweet/ts-utils/types/Webflow';

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
  const { items, itemsPerPage, currentPage, restartIx, restartCommerce, emptyState: oldEmptyState } = listInstance;

  // Collect items and recalculate the total pages
  const itemsToHide: CMSItem[] = [];
  const itemsToShow: CMSItem[] = [];

  let visibleItems = 0;

  for (const item of items) {
    const { mustShow, currentIndex } = item;

    if (mustShow) {
      visibleItems += 1;

      if (!currentPage) {
        itemsToShow.push(item);
        continue;
      }

      const matchesCurrentPage =
        visibleItems > (currentPage - 1) * itemsPerPage && visibleItems <= currentPage * itemsPerPage;

      if (matchesCurrentPage) itemsToShow.push(item);
      else if (typeof currentIndex === 'number') itemsToHide.push(item);
    } else if (typeof currentIndex === 'number') itemsToHide.push(item);
  }

  // Set new properties
  listInstance.visibleItems = visibleItems;
  listInstance.totalPages = Math.ceil(visibleItems / itemsPerPage) || 1;

  const newEmptyState = !visibleItems;
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
  if (restartIx || restartCommerce) {
    const modulesToRestart: WebflowModule[] = [];

    if (restartIx && itemsToShow.some(({ ixRestarted }) => !ixRestarted)) modulesToRestart.push('ix2');
    if (restartCommerce && itemsToShow.some(({ commerceRestarted }) => !commerceRestarted)) {
      modulesToRestart.push('commerce');
    }

    if (modulesToRestart.length) {
      for (const item of items) {
        const rendered = itemsToShow.includes(item);

        if (restartIx) item.ixRestarted = rendered;
        if (restartCommerce) item.commerceRestarted = rendered;
      }
    }

    await restartWebflow(modulesToRestart);
  }

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
