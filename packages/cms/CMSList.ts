import { CMS_CSS_CLASSES, Debug, getCollectionElements, isVisible, restartWebflow } from '@finsweet/ts-utils';

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

/**
 * Creates a new `CMSList` instance, making sure there are no already existing instances on the page.
 * @param referenceElement The Collection List reference element.
 * @returns A new `CMSList` instance, if instantiation was valid.
 */
export const createCMSListInstance = (referenceElement: HTMLElement): CMSList | undefined => {
  const wrapper = getCollectionElements(referenceElement, 'wrapper');
  if (!wrapper) {
    Debug.alert('The element is not a Collection List.', 'error');
    return;
  }

  const existingLists = [...document.querySelectorAll<HTMLElement>(`.${CMS_CSS_CLASSES.wrapper}`)];
  const index = existingLists.findIndex((list) => list === wrapper);
  if (index === -1) return;

  const { fsAttributes } = window;

  fsAttributes.cms ||= {};
  fsAttributes.cms.lists ||= [];
  fsAttributes.cms.lists[index] ||= new CMSList(wrapper, index);

  return window.fsAttributes.cms?.lists?.[index];
};

/**
 * Instance of a Collection List.
 */
export class CMSList {
  public readonly list: CollectionListElement;
  public readonly paginationNext?: PaginationButtonElement | null;
  public readonly paginationPrevious?: PaginationButtonElement | null;
  public readonly itemsPerPage: number;
  public readonly items: CMSItem[];

  private animation?: ItemsAnimation;

  /**
   * @param wrapper A `Collection List Wrapper` element.
   * @param index The index of the list on the page.
   */
  constructor(public readonly wrapper: CollectionListWrapperElement, public readonly index: number) {
    // DOM Elements
    this.list = getCollectionElements(this.wrapper, 'list') as CollectionListElement;
    this.paginationNext = getCollectionElements(this.wrapper, 'next');
    this.paginationPrevious = getCollectionElements(this.wrapper, 'previous');

    const collectionItems = getCollectionElements(this.wrapper, 'items');
    this.itemsPerPage = collectionItems.length;

    // Stores
    this.items = collectionItems.map((element) => new CMSItem(element, this.list));

    // List Index
    const existingLists = [...document.querySelectorAll<HTMLElement>(`.${CMS_CSS_CLASSES.wrapper}`)];
    this.index = existingLists.findIndex((list) => list === this.wrapper);
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
  public addItems(itemElements: CollectionItemElement[], show = true, callback?: (items: CMSItem[]) => void): void {
    const { items, list } = this;

    const newItems = itemElements.map((item) => {
      const instance = new CMSItem(item, list);

      return instance;
    });

    items.push(...newItems);

    if (show) this.showItems(newItems);

    callback?.(newItems);
  }

  /**
   * Shows/hides an item or array of items.
   * @param items The items to show/hide.
   * @param show `true` to show, `false` to hide. `true` by default.
   */
  public async showItems(items: CMSItem | CMSItem[], show = true): Promise<void> {
    const { animation, list } = this;

    if (!Array.isArray(items)) items = [items];

    const validItems = items.filter(({ visible, isShowing, isHiding }) => {
      const validShow = !visible && !isShowing;
      const validHide = visible && !isHiding;

      return show ? validShow : validHide;
    });

    const elements = validItems.map(({ element }) => element);

    for (const item of validItems) item[show ? 'isShowing' : 'isHiding'] = true;

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

    for (const item of validItems) {
      item[show ? 'isShowing' : 'isHiding'] = false;
      item.visible = show;
    }
  }

  /**
   * Hides
   * @param items
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
  public visible: boolean;
  public isShowing = false;
  public isHiding = false;

  /**
   * @param element The DOM element of the item.
   * @param list The parent Collection List.
   */
  constructor(public readonly element: CollectionItemElement, public readonly list: CollectionListElement) {
    this.visible = isVisible(element);
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
