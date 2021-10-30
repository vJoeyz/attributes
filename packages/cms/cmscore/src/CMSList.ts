import Emittery from 'emittery';
import { CMSItem } from './CMSItem';
import { getCollectionElements } from '@finsweet/ts-utils';
import { getInstanceIndex } from '$utils/attributes';
import { renderListItems } from './render';

import type { Animation } from 'packages/animation/src/types';
import type { CMSListEvents } from './types';
import type {
  CollectionListWrapperElement,
  CollectionListElement,
  PaginationButtonElement,
  CollectionItemElement,
} from '@finsweet/ts-utils';

/**
 * Instance of a Collection List.
 */
export class CMSList extends Emittery<CMSListEvents> {
  public readonly list: CollectionListElement;
  public readonly paginationNext?: PaginationButtonElement | null;
  public readonly paginationPrevious?: PaginationButtonElement | null;
  public readonly index?: number;
  public readonly itemsPerPage: number;

  public items: CMSItem[];
  public listAnimation?: Animation;
  public itemsAnimation?: Animation;
  public currentPage?: number;

  private renderingQueue?: Promise<void>;

  /**
   * @param wrapper A `Collection List Wrapper` element.
   *
   * @param index The index of the list on the page. Used when querying/storing this instance.
   * **Important:** This is not related to the `instanceIndex`, which relates to the number suffix in the attribute:
   * `fs-cmsfilter-element="list-2"` -> `2` is the `instanceIndex`, **not** the `index` of the list on the page.
   */
  constructor(public readonly wrapper: CollectionListWrapperElement, { index }: { index?: number } = {}) {
    super();

    this.index = index;

    // DOM Elements
    this.list = getCollectionElements(this.wrapper, 'list') as CollectionListElement;
    this.paginationNext = getCollectionElements(this.wrapper, 'next');
    this.paginationPrevious = getCollectionElements(this.wrapper, 'previous');

    const collectionItems = getCollectionElements(this.wrapper, 'items');
    this.itemsPerPage = collectionItems.length;

    // Stores
    this.items = collectionItems.map((element, index) => new CMSItem(element, this.list, index));
  }

  /**
   * Stores new Collection Items in a `CMSList` instance.
   * **Important:** It mutates the {@link CMSList.items} object.
   * @param listInstance The `CMSList` instance.
   * @param newItemElements The new Collection Items to store.
   */
  public async addItems(itemElements: CollectionItemElement[]): Promise<void> {
    const { items, list } = this;

    const newItems = itemElements.map((item) => new CMSItem(item, list));

    items.push(...newItems);

    await this.emit('shouldnest', newItems);
    await this.emit('shouldcollectprops', newItems);
    await this.emit('shouldsort', newItems);
    await this.emit('shouldfilter');

    await this.renderItems(true);

    await this.emit('additems', newItems);
  }

  /**
   * Recalculates the list object model based on the current props of the items
   * and triggers de correspondent mutations.
   *
   * @param addingItems Defines if new items are being added.
   * If yes, the items will be animated.
   * If not, the list will be animated instead.
   */
  public async renderItems(addingItems?: boolean): Promise<void> {
    await this.renderingQueue;

    this.renderingQueue = renderListItems(this, addingItems);
  }

  /**
   * Shows / hides the list.
   * If the `listAnimation` exists, it uses that animation.
   *
   * @param show Defaults to `true`.
   *
   * @param animate Defines if the list should be animated during the action.
   * Defaults to `true`.
   */
  public async displayList(show = true, animate = true): Promise<void> {
    const { wrapper, listAnimation } = this;

    if (animate && listAnimation) {
      const { animateIn, animateOut, options } = listAnimation;

      await (show ? animateIn : animateOut)(wrapper, options);
    } else wrapper.style.display = show ? '' : 'none';
  }

  /**
   * @returns An attribute value, if exists on the `Collection List Wrapper` or the `Collection List`.
   * @param attributeKey The key of the attribute
   */
  public getAttribute(attributeKey: string): string | null {
    const { wrapper, list } = this;

    return wrapper.getAttribute(attributeKey) || list.getAttribute(attributeKey);
  }

  /**
   * Gets the instance of the list for a specific attribute key.
   * @param key The attribute key.
   */
  public getInstanceIndex(key: string): number | undefined {
    const { wrapper, list } = this;
    return getInstanceIndex(wrapper, key) || getInstanceIndex(list, key);
  }
}
