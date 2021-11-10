import { clearFormField, isNotEmpty, sameValues } from '@finsweet/ts-utils';
import { clearHighlight, toggleHighlight } from './highlight';
import { normalizeDate } from './dates';

import type { CMSItem } from '$cms/cmscore/src';
import type { FilterData, FilterElement, FiltersData } from './types';

/**
 * Assesses if an item should be displayed/hidden based on the filters.
 * @param item The {@link CMSItem} to assess.
 * @param filtersData The {@link FiltersData} object.
 * @param filtersAreEmpty Defines if the current filters are empty.
 * @returns `true` to show, `false` to hide the item.
 */
export const assessFilter = (
  item: CMSItem,
  filtersData: FiltersData,
  filtersAreEmpty: boolean,
  highlightActivated: boolean,
  highlightCSSClass: string
): boolean => {
  if (filtersAreEmpty) {
    if (highlightActivated) clearHighlight(item, highlightCSSClass);

    return true;
  }

  return filtersData.every((filterData) => checkFilterValidity(item, filterData, highlightCSSClass));
};

/**
 * Checks if a CMSItem's props match the filter values.
 * @param item The {@link CMSItem} instance.
 * @param filter The data of a specific filter key.
 * @returns `true` when the `CMSItem` matches the conditions.
 */
const checkFilterValidity = (
  item: CMSItem,
  { filterKeys, values, match, mode: filterMode, highlight }: FiltersData[number],
  highlightCSSClass: string
) => {
  const filterValues = [...values].filter(isNotEmpty);
  if (!filterValues.length) return true;

  const isGlobal = filterKeys.includes('*');

  if (isGlobal) filterKeys = Object.keys(item.props);

  const validFilterKeys = filterKeys.filter((filterKey) => {
    // Get prop data
    const prop = item.props[filterKey];
    if (!prop) return false;

    const { values, type: propType, range: propRange } = prop;

    const propValues = [...values];
    if (!propValues.length) return false;

    // Range Filter Modes
    if (filterMode === 'range') {
      const [propValue] = propValues;
      const [filterFrom, filterTo] = filterValues;

      const isValid = checkRangeValidity(propValue, filterFrom, filterTo, propType);

      if (highlight) toggleHighlight(prop, isValid ? [[propValue]] : [], highlightCSSClass);

      return isValid;
    }

    // Regular Filter Modes
    const matchingPropValues: Array<[string] | [string, string]> = [];

    const matchingFilterValues = filterValues.filter((filterValue) => {
      // Range Prop Values
      if (propRange === 'from' || propRange === 'to') {
        const [propFrom, propTo] = propValues;

        const isValid = checkRangeValidity(filterValue, propFrom, propTo, propType);

        if (isValid) matchingPropValues.push([propFrom], [propTo]);

        return isValid;
      }

      // Regular Prop Values
      const hasValue = propValues.some((propValue) => {
        let isValid: boolean;

        // Date Prop
        if (propType === 'date' && !isGlobal) {
          const [filterDateTime, propDateTime] = [filterValue, propValue].map((value) =>
            normalizeDate(value).getTime()
          );

          isValid = filterDateTime === propDateTime;
        }

        // Single Prop Value
        else if (propValues.length === 1 || filterKeys.length > 1) {
          isValid = propValue.toLowerCase().includes(filterValue.toLowerCase());
        }

        // Multiple Prop Values
        else isValid = filterValue.toLowerCase() === propValue.toLowerCase();

        if (isValid) matchingPropValues.push([propValue, filterValue]);

        return isValid;
      });

      return hasValue;
    });

    if (highlight) toggleHighlight(prop, matchingPropValues, highlightCSSClass);

    return match === 'all' ? matchingFilterValues.length === filterValues.length : matchingFilterValues.length > 0;
  });

  return match === 'all' ? validFilterKeys.length === filterKeys.length : validFilterKeys.length > 0;
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
  const [filterValue, propFrom, propTo] = [value, from, to].map((string) =>
    type === 'date' ? normalizeDate(string) : parseFloat(string)
  );

  if (!from) return filterValue <= propTo;

  if (!to) return filterValue >= propFrom;

  return filterValue >= propFrom && filterValue <= propTo;
};

/**
 * Removes the value of a specific filter and clears the correspondent `FormField` element.
 * @param filterKeys The keys of the filter.
 * @param value The specific value to remove-
 * @param filtersData The {@link FiltersData} object.
 */
export const removeFilterValue = (filterKeys: string[], value: string, filtersData: FiltersData) => {
  const filterData = filtersData.find((data) => sameValues(data.filterKeys, filterKeys));
  if (!filterData) return;

  const elements = filterData.elements.filter((elementData) => elementData.value === value);

  filterData.values.delete(value);

  for (const { element } of elements) clearFormField(element, ['input']);
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
