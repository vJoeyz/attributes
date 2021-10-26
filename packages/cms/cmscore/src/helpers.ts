import { CMSItem } from '.';

import type { CMSItemProps } from './types';

/**
 * Collects the props of {@link CMSItem} elements and stores them in their instance.
 * @param items The `CMSItems` to collect.
 * @returns Nothing, it mutates the passed `CMSItem` instances.
 */
export const collectItemsProps = (
  items: CMSItem[],
  { fieldKey, typeKey, rangeKey }: { fieldKey: string; typeKey?: string; rangeKey?: string }
): void => {
  for (const item of items) {
    const elements = [...item.element.querySelectorAll<HTMLElement>(`[${fieldKey}]`)];

    const itemProps = elements.reduce<CMSItemProps>((props, element) => {
      const filterKey = element.getAttribute(fieldKey);
      const type = typeKey ? element.getAttribute(typeKey) : undefined;
      const range = rangeKey ? element.getAttribute(rangeKey) : undefined;

      const { textContent } = element;

      if (!filterKey || !textContent) return props;

      props[filterKey] ||= { type, range, values: new Set() };

      const prop = props[filterKey];
      const { values } = prop;

      if (range === 'from' || range === 'to') {
        const newValues = [...values];
        newValues[range === 'from' ? 0 : 1] = textContent;

        prop.values = new Set(newValues);
      }

      values.add(textContent);

      return props;
    }, {});

    item.props = itemProps;
  }
};
