import { CMS_CSS_CLASSES, Debug, getCollectionElements, isVisible, restartWebflow } from '@finsweet/ts-utils';
import { createDerived, createStore, getValue, update } from 'nanostores';

import type { WritableStore, ReadableStore } from 'nanostores';
import type { Animation, AnimationOptions } from './animations';
import type {
  CollectionListWrapperElement,
  CollectionListElement,
  CollectionItemElement,
  PaginationButtonElement,
} from '@finsweet/ts-utils';

// Types
interface ItemAnimation extends Animation {
  options?: AnimationOptions;
}

/**
 * Instance of a Collection List.
 */
export class CMSList {
  public readonly index: number;
  public readonly wrapper: CollectionListWrapperElement;
  public readonly list: CollectionListElement;
  public readonly paginationNext?: PaginationButtonElement | null;
  public readonly paginationPrevious?: PaginationButtonElement | null;
  public readonly itemsPerPage: number;
  public readonly itemsStore: WritableStore<CMSItem[]>;

  private readonly mountedItemsStore: ReadableStore<CMSItem[]>;
  private readonly unmountedItemsStore: ReadableStore<CMSItem[]>;

  /**
   * @param referenceElement Either a `Collection List` or a `Collection List Wrapper` element.
   * @param animation An `ItemAnimation` interface to use when showing/hiding items in the list.
   */
  constructor(referenceElement: HTMLElement, private animation?: ItemAnimation) {
    // DOM Elements
    this.wrapper =
      getCollectionElements(referenceElement, 'wrapper') ||
      Debug.alert('The element is not a Collection List.', 'error');
    this.list = getCollectionElements(this.wrapper, 'list') as CollectionListElement;
    this.paginationNext = getCollectionElements(this.wrapper, 'next');
    this.paginationPrevious = getCollectionElements(this.wrapper, 'previous');

    const collectionItems = getCollectionElements(this.wrapper, 'items');
    this.itemsPerPage = collectionItems.length;

    // Stores
    this.itemsStore = createStore(() => {
      this.itemsStore.set(collectionItems.map((element) => new CMSItem(element, this.list, animation)));
    });
    this.mountedItemsStore = createDerived(this.itemsStore, (items) => items.filter((item) => item.mounted));
    this.unmountedItemsStore = createDerived(this.itemsStore, (items) => items.filter((item) => !item.mounted));

    // List Index
    const existingLists = [...document.querySelectorAll<HTMLElement>(`.${CMS_CSS_CLASSES.wrapper}`)];
    this.index = existingLists.findIndex((list) => list === this.wrapper);

    this.listenEvents();
  }

  /**
   * Listens for store events.
   */
  private listenEvents() {
    const { mountedItemsStore, unmountedItemsStore } = this;

    mountedItemsStore.listen(async (items) => {
      for (const item of items) item.show();
      await restartWebflow();
    });

    unmountedItemsStore.listen((items) => {
      for (const item of items) item.hide();
    });
  }

  /**
   * Adds a new animation to the items.
   * @param animation The ItemAnimation object.
   */
  public addAnimation(animation: ItemAnimation): void {
    this.animation = animation;

    for (const item of this.getItems()) item.addAnimation(animation);
  }

  /**
   * @returns The stored items.
   */
  public getItems = (): readonly CMSItem[] => getValue(this.itemsStore);

  /**
   * Stores new Collection Items.
   * @param newItems The new Collection Items to store.
   * @param mount If set to `true`, the new items will be automatically appended to the list. Defaults to `true`.
   * @param callback Provides the newly created item instances.
   */
  public addItems(newItems: CollectionItemElement[], mount = true, callback?: (items: CMSItem[]) => void): void {
    const { itemsStore, list, animation } = this;

    update(itemsStore, (existingItems) => {
      const items = [
        ...existingItems,
        ...newItems.map((item) => {
          const instance = new CMSItem(item, list, animation);
          instance.mounted = mount;

          return instance;
        }),
      ];

      callback?.(items);

      return items;
    });
  }

  /**
   * Updates the stored items. Reference: {@link [nanostores](https://github.com/nanostores/nanostores#guide) }
   * @param callback The callback provided to update the stored items.
   */
  public updateItems(callback: (items: readonly CMSItem[]) => readonly CMSItem[]): void {
    update(this.itemsStore, callback);
  }

  /**
   * @returns An attribute value, if exists on the `Collection List Wrapper` or the `Collection List`.
   * @param attributeKey The key of the attribute
   */
  public getAttribute(attributeKey: string): string | null {
    const { wrapper, list } = this;

    return wrapper.getAttribute(attributeKey) || list.getAttribute(attributeKey);
  }
}

// `CMSItem` Types
type CMSItemPropValue = string | string[];
interface CMSItemProps {
  [key: string]: CMSItemPropValue;
}

/**
 * An instance of a Collection List Item.
 */
class CMSItem {
  public readonly props: CMSItemProps = {};
  public mounted: boolean;

  private visible: boolean;
  private isShowing = false;
  private isHiding = false;

  /**
   * @param element The DOM element of the item.
   * @param list The parent Collection List.
   * @param animation An `ItemAnimation` interface to use when showing/hiding the item.
   */
  constructor(
    private readonly element: CollectionItemElement,
    private readonly list: CollectionListElement,
    private animation?: ItemAnimation
  ) {
    this.mounted = document.body.contains(element);
    this.visible = isVisible(element);
  }

  /**
   * Adds a new animation to the item.
   * @param animation The ItemAnimation object.
   */
  public addAnimation(animation: ItemAnimation) {
    this.animation = animation;
  }

  /**
   * Mounts the item to the DOM and shows it using an animation.
   * @returns An awaitable `Promise`.
   */
  public async show() {
    const { visible, isShowing, element, list, animation } = this;
    if (visible || isShowing) return;

    this.isShowing = true;

    if (animation) await animation.in(element, { target: list, ...animation.options });
    else list.appendChild(element);

    this.isShowing = false;
    this.visible = true;
  }

  /**
   * Hides the item using an animation and removes it from the DOM.
   * @returns An awaitable `Promise`.
   */
  public async hide() {
    const { visible, isHiding, element, animation } = this;
    if (!visible || isHiding) return;

    this.isHiding = true;

    if (animation) await animation.out(element, { remove: true, ...animation.options });
    else element.remove();

    this.isHiding = false;
    this.visible = false;
  }

  /**
   * Adds a property to the item.
   * @param key The key of the property.
   * @param value The value of the property.
   */
  public addProp(key: string, value: CMSItemPropValue) {
    this.props[key] = value;
  }
}
