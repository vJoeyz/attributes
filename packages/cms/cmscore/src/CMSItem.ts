import type { CollectionListElement, CollectionItemElement } from '@finsweet/ts-utils';
import type { CMSItemProps } from './types';

/**
 * An instance of a `Collection List Item`.
 */
export class CMSItem {
  public readonly href?: string;

  public props: CMSItemProps = {};
  public mustShow = true;
  public rendering?: Promise<void>;
  public animating?: Promise<void>;

  /**
   * @param element The DOM element of the item.
   * @param list The parent Collection List.
   */
  constructor(
    public readonly element: CollectionItemElement,
    public readonly list: CollectionListElement,
    public currentIndex?: number
  ) {
    this.href = element.querySelector('a')?.href;
  }
}
