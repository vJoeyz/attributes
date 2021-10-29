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
 * @param animateItems Defines if the items should be animated when rendering them.
 * If not, the list will be animated instead.
 */
export const renderListItems = async (listInstance: CMSList, animateItems: boolean) => {
  const { items, itemsPerPage, currentPage, listAnimation } = listInstance;

  // Collect items
  const itemsToHide: CMSItem[] = [];
  let itemsToShow: CMSItem[] = [];

  for (const item of items) {
    const { mustShow, currentIndex } = item;

    if (mustShow) itemsToShow.push(item);
    else if (typeof currentIndex === 'number') itemsToHide.push(item);
  }

  if (currentPage) {
    itemsToShow = itemsToShow.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);
  }

  // Prepare items to show
  const itemsToAnchor: AnchorData[] = [];

  itemsToShow.forEach((item, index) => {
    if (item.currentIndex !== index) itemsToAnchor.push([item, index, itemsToShow[index - 1]]);
  });

  console.log({ itemsToAnchor });

  // Hide the list
  if (!animateItems && listAnimation) await listInstance.displayList(false);

  // Render the items
  await Promise.all([
    ...hideItems(itemsToHide, listInstance, animateItems),
    ...showItems(itemsToAnchor, listInstance, animateItems),
  ]);

  // Show the list
  if (!animateItems && listAnimation) await listInstance.displayList();
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
  return itemsToAnchor.map(async ([item, index, anchor]) => {
    item.animating = new Promise(async (resolveAnimating) => {
      item.rendering = new Promise(async (resolveRendering) => {
        await anchor?.rendering;

        const { element, currentIndex } = item;

        const anchorElement = anchor?.element || null;

        let animationFinish: Promise<void> | undefined;

        if (typeof currentIndex !== 'number' && animateItems && itemsAnimation) {
          const { animateIn, options } = itemsAnimation;
          const { stagger } = options || {};

          if (stagger) await wait(stagger);

          animationFinish = animateIn(element, { target: list, insertAfter: anchorElement, ...options });

          resolveRendering();
        } else {
          if (anchorElement) list.insertBefore(element, anchorElement.nextSibling);
          else list.prepend(element);

          resolveRendering();
        }

        item.currentIndex = index;

        await animationFinish;

        resolveAnimating();
      });
    });

    await item.rendering;
  });
};
