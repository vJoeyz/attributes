import { CMSItem } from '.';

import type { CMSItemProps } from './types';

/**
 * Collects the props of {@link CMSItem} elements and stores them in their instance.
 * @param items The `CMSItems` to collect.
 * @returns Nothing, it mutates the passed `CMSItem` instances.
 */
export const collectItemsProps = (
  items: CMSItem[],
  { fieldKey, typeKey, modeKey }: { fieldKey: string; typeKey?: string; modeKey?: string }
): void => {
  for (const item of items) {
    const elements = [...item.element.querySelectorAll<HTMLElement>(`[${fieldKey}]`)];

    const itemProps = elements.reduce<CMSItemProps>((props, element) => {
      const filterKey = element.getAttribute(fieldKey);
      const type = typeKey ? element.getAttribute(typeKey) : undefined;
      const mode = modeKey ? element.getAttribute(modeKey) : undefined;

      const { textContent } = element;

      if (!filterKey || !textContent) return props;

      props[filterKey] ||= { type, mode, values: new Set() };

      const prop = props[filterKey];
      const { values } = prop;

      if (mode === 'from' || mode === 'to') {
        const newValues = [...values];
        newValues[mode === 'from' ? 0 : 1] = textContent;

        prop.values = new Set(newValues);
      }

      values.add(textContent);

      return props;
    }, {});

    item.props = itemProps;
  }
};
