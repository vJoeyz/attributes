import { isKeyOf, isNotEmpty } from '@finsweet/ts-utils';
import { RANGE_MODES } from './constants';

import type { MapEntries } from '@finsweet/ts-utils';
import type { FiltersValues, GrouppedFilterKeys } from './CMSFilter';
import type { CMSItem } from 'packages/cms/cmscore/src';

// Constants
const dateFormatter = Intl.DateTimeFormat();

/**
 * Assesses if an item should be displayed/hidden based on the filters.
 * @param item The item to assess.
 * @param filters The active filters to apply.
 * @returns `true` to show, `false` to hide the item.
 */
export const assessFilter = (
  item: CMSItem,
  filters: MapEntries<FiltersValues>,
  grouppedFilterKeys: GrouppedFilterKeys
): boolean => {
  const filtersValidity = filters.map((filter) => [filter[0], checkFilterValidity(item, filter)] as const);

  const grouppedFiltersValid = grouppedFilterKeys.every((grouppedKeys) =>
    grouppedKeys.some((grouppedKey) => filtersValidity.find(([filterKey, valid]) => grouppedKey === filterKey && valid))
  );

  console.log({ item, filtersValidity, grouppedFiltersValid });

  const nonGrouppedFiltersValid = filtersValidity
    .filter(([filterKey]) => grouppedFilterKeys.every((filterKeys) => !filterKeys.includes(filterKey)))
    .every(([, valid]) => valid);

  return grouppedFiltersValid && nonGrouppedFiltersValid;
};

/**
 * Checks if a CMSItem's props match the filter values.
 * @param item The `CMSItem` instance.
 * @param filter The data of a specific filter key.
 * @returns `true` when the `CMSItem` matches the conditions.
 */
const checkFilterValidity = (
  item: CMSItem,
  [filterKey, { values, match, mode, type }]: MapEntries<FiltersValues>[number]
) => {
  const filterValues = [...values]
    .filter(isNotEmpty)
    .map((value) => (type === 'date' ? dateFormatter.format(new Date(value)) : value));

  if (!filterValues.length) return true;

  if (isKeyOf(mode, RANGE_MODES)) {
    const [from, to] = filterValues;

    const { values } = item.props[filterKey] || {};
    if (!values) return false;

    const [propValue] = values;
    if (!propValue) return false;

    const numberValue = parseFloat(propValue);
    const dateValue = new Date(dateFormatter.format(new Date(propValue)));

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
    const hasValue = item.props[filterKey]?.values.some((propValue) => {
      if (type === 'date') return filterValue === dateFormatter.format(new Date(propValue));

      if (type && ['text', 'number', 'email', 'password', 'tel', 'textarea'].includes(type)) {
        return propValue.toLowerCase().includes(filterValue.toLowerCase());
      }

      return filterValue === propValue;
    });

    return hasValue;
  });
};
