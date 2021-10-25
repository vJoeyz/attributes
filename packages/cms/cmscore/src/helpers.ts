import { CMSItem } from '.';

import type { CMSList } from '.';
import type { CMSItemProps } from './types';
import type { CollectionItemElement } from '@finsweet/ts-utils';

/**
 * Stores new Collection Items in a `CMSList` instance.
 * @param listInstance The CMSList instance.
 * @param newItemElements The new Collection Items to store.
 */
export const addItemsToList = async (
  listInstance: CMSList,
  newItemElements: CollectionItemElement[]
): Promise<void> => {
  const { items, list, showNewItems } = listInstance;

  const newItems = newItemElements.map((item) => new CMSItem(item, list));

  items.push(...newItems);

  await listInstance.emitSerial('beforeadditems', newItems);

  if (showNewItems) await listInstance.renderItems(newItems);

  await listInstance.emitSerial('afteradditems', newItems);
};

/**
 * Collects the props of {@link CMSItem} elements and stores them in their instance.
 * @param items The `CMSItems` to collect.
 * @returns Nothing, it mutates the passed `CMSItem` instances.
 */
export const collectItemsProps = (items: CMSItem[], fieldKey: string, typeKey?: string): void => {
  for (const item of items) {
    const elements = [...item.element.querySelectorAll<HTMLElement>(`[${fieldKey}]`)];

    const itemProps = elements.reduce<CMSItemProps>((props, element) => {
      const filterKey = element.getAttribute(fieldKey);
      const type = typeKey ? element.getAttribute(typeKey) : undefined;

      const { textContent } = element;

      if (!filterKey || !textContent) return props;

      props[filterKey] ||= { values: [], type };
      props[filterKey].values.push(textContent);

      return props;
    }, {});

    item.props = itemProps;
  }
};
