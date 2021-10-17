import { isNotEmpty } from '@finsweet/ts-utils';

import type { MapEntries } from '@finsweet/ts-utils';
import type { ActiveFilters } from './CMSFilter';
import type { CMSItem } from 'packages/cms/CMSList';

/**
 * Assesses if an item should be displayed/hidden based on the filters.
 * @param item The item to assess.
 * @param filters The active filters to apply.
 * @returns `true` to show, `false` to hide the item.
 */
export const assessFilter = (item: CMSItem, filters: MapEntries<ActiveFilters>): boolean => {
  return filters.every(([filterKey, { values, match, type }]) => {
    const dateFormatter = Intl.DateTimeFormat();

    const filterValues = [...values]
      .filter(isNotEmpty)
      .map((value) => (type === 'date' ? dateFormatter.format(new Date(value)) : value));

    if (!filterValues.length) return true;

    if (match === 'range') {
      const [from, to] = filterValues;

      const [value] = item.props[filterKey];

      const numberValue = parseFloat(value);
      const dateValue = new Date(dateFormatter.format(new Date(value)));

      if (!from && !to) return true;

      if (!from) {
        if (type === 'date') return dateValue <= new Date(to);

        return numberValue <= parseFloat(to);
      }

      if (!to) {
        if (type === 'date') return dateValue >= new Date(from);

        return numberValue >= parseFloat(from);
      }

      if (type === 'date') return dateValue >= new Date(from) && dateValue <= new Date(to);

      return numberValue >= parseFloat(from) && numberValue <= parseFloat(to);
    }

    return filterValues[match === 'all' ? 'every' : 'some']((filterValue) => {
      const hasValue = item.props[filterKey]?.some((value) => {
        if (type === 'date') return filterValue === dateFormatter.format(new Date(value));

        if (type && ['text', 'number', 'email', 'password', 'tel', 'textarea'].includes(type)) {
          return value.toLowerCase().includes(filterValue.toLowerCase());
        }

        return filterValue === value;
      });

      return hasValue;
    });
  });
};
