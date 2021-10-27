import Emittery from 'emittery';
import { getCollectionElements } from '@finsweet/ts-utils';
import { getInstanceIndex } from '$utils/attributes';
import { CMSItem } from './CMSItem';

import type { CollectionListWrapperElement, CollectionListElement, PaginationButtonElement } from '@finsweet/ts-utils';
import type { Animation } from 'packages/animation/src/types';
import type { CMSListEvents } from './types';

/**
 * Instance of a Collection List.
 */
export class CMSList extends Emittery<CMSListEvents> {
  public readonly list: CollectionListElement;
  public readonly paginationNext?: PaginationButtonElement | null;
  public readonly paginationPrevious?: PaginationButtonElement | null;
  public readonly pageIndex?: number;
  public readonly initialItems: CMSItem[];

  public items: CMSItem[];
  public showNewItems = true;
  public listAnimation?: Animation;
  public itemsAnimation?: Animation;

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

    // Stores
    this.initialItems = collectionItems.map((element) => new CMSItem(element, this.list));
    this.items = [...this.initialItems];
  }

  /**
   * Shows/hides an item or array of items.
   *
   * @param items The items to show/hide.
   * @param show `true` to show, `false` to hide. `true` by default.
   * @param animate Defines if the items should be animated when rendering them.
   */
  public async renderItems(items: CMSItem | CMSItem[], show = true, animate = true): Promise<void> {
    const { itemsAnimation: animation, list } = this;

    if (!Array.isArray(items)) items = [items];

    if (!items.length) return;

    const elements = items.map(({ element }) => element);

    for (const item of items) item[show ? 'isShowing' : 'isHiding'] = true;

    if (animate && animation) {
      const { animateIn, animateOut, options } = animation;

      if (show) await animateIn(elements, { target: list, ...options });
      else await animateOut(elements, { remove: true, ...options });
    } else {
      for (const element of elements) {
        if (show) list.appendChild(element);
        else element.remove();
      }
    }

    for (const item of items) {
      item[show ? 'isShowing' : 'isHiding'] = false;
      item.visible = show;
    }
  }

  /**
   * Shows / hides the list.
   * If the `listAnimation` exists, it uses that animation.
   *
   * @param show Defaults to `true`.
   *
   * @param animate Defines if the list should be animated (`fadeOut` + `fadeIn`) during the action.
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
