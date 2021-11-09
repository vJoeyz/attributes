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
  CollectionItemElement,
  PaginationButtonElement,
  PaginationWrapperElement,
  PageCountElement,
} from '@finsweet/ts-utils';

/**
 * Instance of a Collection List.
 */
export class CMSList extends Emittery<CMSListEvents> {
  public readonly list: CollectionListElement;

  public readonly paginationWrapper?: PaginationWrapperElement | null;
  public readonly paginationNext?: PaginationButtonElement | null;
  public readonly paginationCount?: PageCountElement | null;

  public readonly itemsPerPage: number;

  public paginationPrevious?: PaginationButtonElement | null;
  public scrollAnchor?: HTMLElement;
  public itemsCount?: HTMLElement;

  public emptyElement?: HTMLElement;
  public emptyState?: boolean;

  public loader?: HTMLElement;

  public visibleItems: number;
  public totalPages: number;
  public currentPage?: number;

  public items: CMSItem[];

  public listAnimation?: Animation;
  public itemsAnimation?: Animation;

  public resetIx = false;

  private renderingQueue?: Promise<void>;

  /**
   * @param wrapper A `Collection List Wrapper` element.
   *
   * @param index The index of the list on the page. Used when querying/storing this instance.
   * **Important:** This is not related to the `instanceIndex`, which relates to the number suffix in the attribute:
   * `fs-cmsfilter-element="list-2"` -> `2` is the `instanceIndex`, **not** the `index` of the list on the page.
   */
  constructor(public readonly wrapper: CollectionListWrapperElement, public readonly index?: number) {
    super();

    // DOM Elements
    this.list = getCollectionElements(this.wrapper, 'list') as CollectionListElement;
    this.paginationWrapper = getCollectionElements(this.wrapper, 'pagination');
    this.paginationNext = getCollectionElements(this.wrapper, 'next');
    this.paginationPrevious = getCollectionElements(this.wrapper, 'previous');
    this.paginationCount = getCollectionElements(this.wrapper, 'pageCount');

    const collectionItems = getCollectionElements(this.wrapper, 'items');

    this.visibleItems = this.itemsPerPage = collectionItems.length;
    this.totalPages = 1;

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
    const { items, list, itemsCount } = this;

    const newItems = itemElements.map((item) => new CMSItem(item, list));

    items.push(...newItems);

    await this.emit('shouldnest', newItems);
    await this.emit('shouldcollectprops', newItems);
    await this.emit('shouldsort', newItems);
    await this.emit('shouldfilter');

    await this.renderItems(true);

    if (itemsCount) itemsCount.textContent = `${items.length}`;

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

    return new Promise(async (resolve) => {
      const queueItem = renderListItems(this, addingItems);

      this.renderingQueue = queueItem;

      await queueItem;
      resolve();
    });
  }

  /**
   * Shows / hides the requested element.
   * If the `listAnimation` exists, it uses that animation.
   *
   * @param elementKey The element to show/hide.
   *
   * @param show Defaults to `true`.
   * @param animate Defaults to `true`.
   */
  public async displayElement(
    elementKey: 'list' | 'emptyElement' | 'paginationNext' | 'paginationPrevious' | 'loader',
    show = true,
    animate = true
  ): Promise<void> {
    const { listAnimation } = this;

    const elementToDisplay = this[elementKey];
    if (!elementToDisplay) return;

    if (listAnimation && animate) {
      const { animateIn, animateOut, options } = listAnimation;

      await (show ? animateIn : animateOut)(elementToDisplay, options);
    } else elementToDisplay.style.display = show ? '' : 'none';
  }

  /**
   * Switches the current page.
   * @param targetPage The target page to set.
   * @returns An awaitable Promise that resolves after the list has re-rendered.
   */
  public async switchPage(targetPage: number) {
    const { currentPage: previousPage } = this;

    if (targetPage === previousPage) return;

    await this.emit('switchpage', targetPage);

    this.currentPage = targetPage;

    this.scrollToAnchor();

    if (previousPage) await this.renderItems();
  }

  /**
   * Adds an `Empty State` element to the list.
   * @param element The element to add.
   */
  public addEmptyElement(element: HTMLElement) {
    const { wrapper, list, emptyElement } = this;

    if (emptyElement) return;

    element.style.display = 'none';
    wrapper.insertBefore(element, list.nextSibling);

    this.emptyElement = element;
  }

  /**
   * Adds a `Pagination Previous` button to the list.
   * @param element The element to add.
   */
  public addPaginationPrevious(element: PaginationButtonElement) {
    const { paginationPrevious, paginationNext } = this;

    if (paginationPrevious) return;

    element.style.display = 'none';
    paginationNext?.parentElement?.prepend(element);

    this.paginationPrevious = element;
  }

  /**
   * Adds a `Loader` element to the list.
   * @param element The element to add.
   */
  public addLoader(element: HTMLElement) {
    const { loader } = this;

    if (loader) return;

    element.style.display = 'none';

    this.loader = element;
  }

  /**
   * Adds an `Items Count` element to the list.
   * @param element The element to add.
   */
  public addItemsCount(element: HTMLElement) {
    const { itemsCount, items } = this;

    if (itemsCount) return;

    element.textContent = `${items.length}`;

    this.itemsCount = element;
  }

  /**
   * Scrolls to the anchor element of the list.
   */
  public scrollToAnchor() {
    this.scrollAnchor?.scrollIntoView({ behavior: 'smooth' });
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
