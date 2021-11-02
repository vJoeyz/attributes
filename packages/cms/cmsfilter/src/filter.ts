import { clearFormField, isNotEmpty, sameValues } from '@finsweet/ts-utils';
import { normalizeDate } from './dates';

import type { CMSItem } from '$cms/cmscore/src';
import type { FilterData, FilterElement, FiltersData } from './types';

/**
 * Assesses if an item should be displayed/hidden based on the filters.
 * @param item The item to assess.
 * @param filters The active filters to apply.
 * @returns `true` to show, `false` to hide the item.
 */
export const assessFilter = (item: CMSItem, filtersData: FiltersData): boolean => {
  return filtersData.every((filterData) => checkFilterValidity(item, filterData));
};

/**
 * Checks if a CMSItem's props match the filter values.
 * @param item The `CMSItem` instance.
 * @param filter The data of a specific filter key.
 * @returns `true` when the `CMSItem` matches the conditions.
 */
const checkFilterValidity = (item: CMSItem, { filterKeys, values, match, mode: filterMode }: FiltersData[number]) => {
  const filterValues = [...values].filter(isNotEmpty);
  if (!filterValues.length) return true;

  return filterKeys[match === 'all' ? 'every' : 'some']((filterKey) => {
    // Range Filter Modes
    if (filterMode === 'range') {
      const prop = item.props[filterKey];
      if (!prop) return false;

      const { type: propType, values: propValues } = prop;
      if (!propValues.size) return false;

      const [propValue] = propValues;
      const [filterFrom, filterTo] = filterValues;

      return checkRangeValidity(propValue, filterFrom, filterTo, propType);
    }

    // Regular Filter Modes
    return filterValues[match === 'all' ? 'every' : 'some']((filterValue) => {
      const prop = item.props[filterKey];
      if (!prop) return false;

      const { values, type: propType, range: propRange } = prop;

      const propValues = [...values];
      if (!propValues.length) return false;

      // Range Prop Values
      if (propRange === 'from' || propRange === 'to') {
        const [propFrom, propTo] = propValues;

        return checkRangeValidity(filterValue, propFrom, propTo, propType);
      }

      // Regular Prop Values
      const hasValue = propValues.some((propValue) => {
        if (propType === 'date') {
          const [filterDateTime, propDateTime] = [filterValue, propValue].map((value) =>
            normalizeDate(value).getTime()
          );

          return filterDateTime === propDateTime;
        }

        if (propValues.length === 1 || filterKeys.length > 1) {
          return propValue.toLowerCase().includes(filterValue.toLowerCase());
        }

        return filterValue.toLowerCase() === propValue.toLowerCase();
      });

      return hasValue;
    });
  });
};

/**
 * Checks if a value matches the specified `from` and `to` range.
 * @param value The value to assess.
 * @param from The range start.
 * @param to The range end.
 * @param type The type of the values.
 * @returns `true` if it's valid.
 */
const checkRangeValidity = (value: string, from: string, to: string, type?: string | null) => {
  // Date Value
  if (type === 'date') {
    const [filterDateValue, propDateFrom, propDateTo] = [value, from, to].map(normalizeDate);

    if (!from) return filterDateValue <= propDateTo;

    if (!to) return filterDateValue >= propDateFrom;

    return filterDateValue >= propDateFrom && filterDateValue <= propDateTo;
  }

  // Regular Value
  const [filterNumberValue, propNumberFrom, propNumberTo] = [value, from, to].map(parseFloat);

  if (!from) return filterNumberValue <= propNumberTo;

  if (!to) return filterNumberValue >= propNumberFrom;

  return filterNumberValue >= propNumberFrom && filterNumberValue <= propNumberTo;
};

export const removeFilterValue = (filterKeys: string[], value: string, filtersData: FiltersData) => {
  const filterData = filtersData.find((data) => sameValues(data.filterKeys, filterKeys));
  if (!filterData) return;

  const elements = filterData.elements.filter((elementData) => elementData.value === value);

  filterData.values.delete(value);

  for (const { element } of elements) clearFormField(element, ['input']);
};

/**
 * Clears a set of `FiltersData`, including the input values.
 * @param filtersData
 */
export const clearFiltersData = (filtersData: FiltersData) => {
  for (const { elements, values } of filtersData) {
    for (const { element } of elements) clearFormField(element, ['input']);

    values.clear();
  }
};

/**
 * Clears a record of `FilterData`, including the input values.
 * @param filterData The {@link FilterData} object.
 * @param value If passed, only that specific value and the elements that hold it will be cleared.
 */
export const clearFilterData = ({ elements, values }: FilterData, value?: string) => {
  let elementsToClear: FilterElement[];

  if (value) {
    values.delete(value);
    elementsToClear = elements.filter((elementData) => elementData.value === value);
  } else {
    values.clear();
    elementsToClear = elements;
  }

  for (const { element } of elementsToClear) clearFormField(element, ['input']);
};
