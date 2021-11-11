import type { CMSList } from '$cms/cmscore/src';
import type { CMSFilters } from './CMSFilters';
import type { FilterElement } from './types';

/**
 * Updates the displayed results on the `resultsElement`.
 * @param filtersInstance A {@link CMSFilters} instance.
 * @param listInstance A {@link CMSList} instance.
 */
export const updateListResults = ({ resultsElement }: CMSFilters, { validItems }: CMSList) => {
  if (!resultsElement) return;

  resultsElement.textContent = `${validItems.length}`;
};

/**
 * Updates the displayed results of specific filters' `resultsElement`.
 * @param filtersInstance A {@link CMSFilters} instance.
 */
export const updateFilterKeyResults = ({ filtersData }: CMSFilters) => {
  for (const { elements } of filtersData) {
    for (const { resultsElement, resultsCount } of elements) {
      if (!resultsElement) continue;

      resultsElement.textContent = `${resultsCount}`;
    }
  }
};

/**
 * Updates the `resultsCount` for each filter element.
 * @param filtersInstance A {@link CMSFilters} instance.
 * @param listInstance A {@link CMSList} instance.
 */
export const syncFilterKeyResults = ({ filtersData }: CMSFilters, { validItems }: CMSList) => {
  // Memoize filters data
  const data: {
    [filterKey: string]: {
      [value: string]: FilterElement;
    };
  } = {};

  for (const { elements, filterKeys } of filtersData) {
    if (filterKeys.length > 1) continue;

    const [filterKey] = filterKeys;

    data[filterKey] ||= {};

    for (const element of elements) {
      element.resultsCount = 0;
      data[filterKey][element.value] ||= element;
    }
  }

  // Count results
  for (const { props } of validItems) {
    for (const filterKey in props) {
      const filterKeyData = data[filterKey];
      if (!filterKeyData) continue;

      const { values } = props[filterKey];

      for (const value of values) {
        const filterElement = filterKeyData[value];
        if (!filterElement) continue;

        filterElement.resultsCount += 1;
      }
    }
  }
};
