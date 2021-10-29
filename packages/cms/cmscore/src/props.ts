import { CMSItem } from '.';

/**
 * Collects the props of {@link CMSItem} elements and stores them in their instance.
 * @param items The `CMSItems` to collect.
 * @returns Nothing, it mutates the passed `CMSItem` instances.
 */
export const collectItemsProps = (
  items: CMSItem[],
  { fieldKey, typeKey, rangeKey }: { fieldKey: string; typeKey?: string; rangeKey?: string }
): void => {
  for (const { element, props } of items) {
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
};
