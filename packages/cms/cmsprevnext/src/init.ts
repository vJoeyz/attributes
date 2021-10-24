import { cloneNode, isNotEmpty } from '@finsweet/ts-utils';
import { getSelector } from './constants';
import { getCollectionListWrappers } from 'packages/cms/helpers';
import { createCMSListInstance } from 'packages/cms/CMSList';
import { collectElements } from './collect';

import type { CMSItem } from 'packages/cms/CMSList';

/**
 * Inits the attribute.
 */
export const init = async (): Promise<void> => {
  let previousPlaceholderFilled = false;
  let nextPlaceholderFilled = false;

  const collectionListWrappers = getCollectionListWrappers([getSelector('element', 'list', { operator: 'prefixed' })]);

  const listInstances = collectionListWrappers.map(createCMSListInstance).filter(isNotEmpty);
  if (!listInstances.length) return;

  const elements = collectElements();
  if (!elements) return;

  const { previousPlaceholder, nextPlaceholder, previousEmptyElement, nextEmptyElement } = elements;

  const { origin, pathname } = window.location;
  const currentURL = origin + pathname;

  /**
   * @returns `true` When the attribute has already finished.
   */
  const hasCompleted = () =>
    (!previousPlaceholder || (previousPlaceholder && previousPlaceholderFilled)) &&
    (!nextPlaceholder || (nextPlaceholder && nextPlaceholderFilled));

  // Init searching for the items
  for (const listInstance of listInstances) {
    if (hasCompleted()) break;

    /**
     * Looks for the `CMSItem` that corresponds to the current page and retrievews the previous and next items.
     * @param items
     */
    const handleItems = (items: CMSItem[]) => {
      if (hasCompleted()) {
        listInstance.off('afteradditems', handleItems);
        return;
      }

      const currentItemIndex = items.findIndex(({ href }) => href && href === currentURL);
      if (currentItemIndex < 0) return;

      if (previousPlaceholder) {
        const previousItem = items[currentItemIndex - 1];

        if (previousItem && !previousPlaceholderFilled) {
          previousEmptyElement?.remove();
          previousPlaceholder.appendChild(cloneNode(previousItem.element));
          previousPlaceholderFilled = true;
        } else if (previousEmptyElement) previousPlaceholder.appendChild(previousEmptyElement);
      }

      if (nextPlaceholder) {
        const nextItem = items[currentItemIndex + 1];

        if (nextItem && !nextPlaceholderFilled) {
          nextEmptyElement?.remove();
          nextPlaceholder.appendChild(cloneNode(nextItem.element));
          nextPlaceholderFilled = true;
        } else if (nextEmptyElement) nextPlaceholder.appendChild(nextEmptyElement);
      }
    };

    listInstance.on('afteradditems', handleItems);

    handleItems(listInstance.items);
  }
};
