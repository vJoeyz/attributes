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

  /**
   * Collects the props from child elements and stores them.
   * @param attributeKeys The attribute keys to use to collect the props.
   * @returns Nothing, it mutates the passed `CMSItem` instances.
   */
  public collectProps({ fieldKey, typeKey, rangeKey }: { fieldKey: string; typeKey?: string; rangeKey?: string }) {
    const { element, props } = this;

    const fieldElements = [...element.querySelectorAll<HTMLElement>(`[${fieldKey}]`)];

    for (const fieldElement of fieldElements) {
      const filterKey = fieldElement.getAttribute(fieldKey);
      const type = typeKey ? fieldElement.getAttribute(typeKey) : undefined;
      const range = rangeKey ? fieldElement.getAttribute(rangeKey) : undefined;

      const { textContent } = fieldElement;

      if (!filterKey || !textContent) continue;

      props[filterKey] ||= { type, range, values: new Set() };

      const prop = props[filterKey];
      const { values } = prop;

      if (range === 'from' || range === 'to') {
        const newValues = [...values];
        newValues[range === 'from' ? 0 : 1] = textContent;

        prop.values = new Set(newValues);
      }

      values.add(textContent);
    }
  }
}
