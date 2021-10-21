import { extractCommaSeparatedValues } from '@finsweet/ts-utils';
import type { FiltersData, FiltersValues } from './CMSFilter';

const { location, history } = window;

export const getQueryParams = (filtersData: FiltersData, filtersValues: FiltersValues) => {
  const url = new URL(location.href);
  const { searchParams } = url;

  const filterData = [...filtersData.values()];

  for (const [queryKey, queryValue] of searchParams) {
    const keyIsValid = !!filterData.find(({ filterKeys }) => filterKeys.includes(queryKey));
    if (!keyIsValid) continue;

    const values = extractCommaSeparatedValues(queryValue);
  }
};

export const setQueryParams = (filtersValues: FiltersValues) => {
  const url = new URL(location.href);
  const { searchParams } = url;

  for (const [key] of searchParams) searchParams.delete(key);

  for (const [filterKey, { values }] of filtersValues) {
    const value = [...values].join(',');

    url.searchParams.set(filterKey, value);
  }

  history.replaceState(null, '', url.toString());
};
