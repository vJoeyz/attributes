import Emittery from 'emittery';
import { CMS_CSS_CLASSES, Debug, getCollectionElements, isVisible, restartWebflow } from '@finsweet/ts-utils';
import { getInstanceIndex } from '$utils/attributes';

import type { Animation, AnimationOptions } from './animations';
import type {
  CollectionListWrapperElement,
  CollectionListElement,
  CollectionItemElement,
  PaginationButtonElement,
} from '@finsweet/ts-utils';

// Types
interface ItemsAnimation extends Animation {
  options?: AnimationOptions;
  resetIx: boolean;
}

interface CMSListEvents {
  additems: CMSItem[];
}

/**
 * Creates a new `CMSList` instance, making sure there are no already existing instances on the page.
 * @param referenceElement The `Collection List` reference element.
 * @returns A new `CMSList` instance, if instantiation was valid.
 */
export const createCMSListInstance = (referenceElement: HTMLElement): CMSList | undefined => {
  const wrapper = getCollectionElements(referenceElement, 'wrapper');

  if (!wrapper) {
    Debug.alert('The element is not a Collection List.', 'error');
    return;
  }

  const { fsAttributes } = window;

  fsAttributes.cms ||= {};
  fsAttributes.cms.lists ||= [];
  fsAttributes.cms.listElements ||= [
    ...document.querySelectorAll<CollectionListWrapperElement>(`.${CMS_CSS_CLASSES.wrapper}`),
  ];

  const { lists, listElements } = fsAttributes.cms;

  const pageIndex = listElements.indexOf(wrapper);
  if (pageIndex === -1) return;

  lists[pageIndex] ||= new CMSList(wrapper, { pageIndex });

  return lists[pageIndex];
};

/**
 * Instance of a Collection List.
 */
export class CMSList extends Emittery<CMSListEvents> {
  public readonly list: CollectionListElement;
  public readonly paginationNext?: PaginationButtonElement | null;
  public readonly paginationPrevious?: PaginationButtonElement | null;
  public readonly itemsPerPage: number;
  public readonly items: CMSItem[];
  public readonly pageIndex?: number;

  public autoShowNewItems = true;

  private animation?: ItemsAnimation;

  /**
   * @param wrapper A `Collection List Wrapper` element.
   * @param pageIndex The index of the list on the page. Used when querying/storing this instance.
   */
  constructor(public readonly wrapper: CollectionListWrapperElement, { pageIndex }: { pageIndex?: number } = {}) {
    super();

    this.pageIndex = pageIndex;

    // DOM Elements
    this.list = getCollectionElements(this.wrapper, 'list') as CollectionListElement;
    this.paginationNext = getCollectionElements(this.wrapper, 'next');
    this.paginationPrevious = getCollectionElements(this.wrapper, 'previous');

    const collectionItems = getCollectionElements(this.wrapper, 'items');
    this.itemsPerPage = collectionItems.length;

    // Stores
    this.items = collectionItems.map((element) => new CMSItem(element, this.list));
  }

  /**
   * Adds a new animation to the items.
   * @param animation A `ItemsAnimation` object.
   */
  public addAnimation(animation: ItemsAnimation): void {
    this.animation = animation;
  }

  /**
   * Stores new Collection Items.
   * @param itemElements The new Collection Items to store.
   * @param show If set to `true`, the new items will be automatically appended to the list. Defaults to `true`.
   * @param callback Provides the newly created item instances.
   */
  public async addItems(itemElements: CollectionItemElement[], callback?: (items: CMSItem[]) => void): Promise<void> {
    console.log('adding items');
    const { items, list, autoShowNewItems } = this;

    const newItems = itemElements.map((item) => {
      const instance = new CMSItem(item, list);

      return instance;
    });

    items.push(...newItems);

    callback?.(newItems);

    await this.emit('additems', newItems);

    if (autoShowNewItems) this.showItems(newItems);
  }

  /**
   * Shows/hides an item or array of items.
   * @param items The items to show/hide.
   * @param show `true` to show, `false` to hide. `true` by default.
   */
  public async showItems(items: CMSItem | CMSItem[], show = true): Promise<void> {
    const { animation, list } = this;

    if (!Array.isArray(items)) items = [items];

    // const validItems = items.filter(({ visible, isShowing, isHiding }) => {
    //   const validShow = !visible && !isShowing;
    //   const validHide = visible && !isHiding;

    //   return show ? validShow : validHide;
    // });

    // const elements = validItems.map(({ element }) => element);
    const elements = items.map(({ element }) => element);

    // for (const item of validItems) item[show ? 'isShowing' : 'isHiding'] = true;
    for (const item of items) item[show ? 'isShowing' : 'isHiding'] = true;

    if (animation) {
      const { options, resetIx } = animation;

      if (show) await animation.in(elements, { target: list, ...options });
      else await animation.out(elements, { remove: true, ...options });

      if (resetIx) await restartWebflow();
    } else {
      for (const element of elements) {
        if (show) list.appendChild(element);
        else element.remove();
      }
    }

    // for (const item of validItems) {
    for (const item of items) {
      item[show ? 'isShowing' : 'isHiding'] = false;
      item.visible = show;
    }
  }

  /**
   * Hides a set of CMSItems.
   * @param items The items to hide.
   */
  public async hideItems(items: CMSItem | CMSItem[]): Promise<void> {
    this.showItems(items, false);
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

// `CMSItem` Types
type CMSItemPropValue = string[];
export interface CMSItemProps {
  [key: string]: CMSItemPropValue;
}

/**
 * An instance of a `Collection List Item`.
 */
export class CMSItem {
  public readonly props: CMSItemProps = {};
  public readonly href?: string;
  public visible: boolean;
  public isShowing = false;
  public isHiding = false;

  /**
   * @param element The DOM element of the item.
   * @param list The parent Collection List.
   */
  constructor(public readonly element: CollectionItemElement, public readonly list: CollectionListElement) {
    this.visible = isVisible(element);
    this.href = element.querySelector('a')?.href;
  }

  /**
   * Adds a property to the item.
   * @param key The key of the property.
   * @param value The value of the property.
   */
  public addProp(key: string, value: CMSItemPropValue): void {
    this.props[key] = value;
  }
}
