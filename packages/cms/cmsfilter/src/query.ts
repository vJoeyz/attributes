import { extractCommaSeparatedValues } from '@finsweet/ts-utils';
import { FiltersData } from './types';

const { location, history } = window;

// export const getQueryParams = (filtersData: FiltersData) => {
//   const url = new URL(location.href);
//   const { searchParams } = url;

//   const filterData = [...filtersData.values()];

//   for (const [queryKey, queryValue] of searchParams) {
//     const keyIsValid = !!filterData.find(({ filterKeys }) => filterKeys.includes(queryKey));
//     if (!keyIsValid) continue;

//     const values = extractCommaSeparatedValues(queryValue);
//   }
// };

export const setQueryParams = (filtersData: FiltersData) => {
  const url = new URL(location.href);
  const { searchParams } = url;

  for (const [key] of searchParams) searchParams.delete(key);

  for (const { filterKeys, values } of filtersData) {
    const value = [...values].join(',');

    for (const filterKey of filterKeys) url.searchParams.set(filterKey, value);
  }

  history.replaceState(null, '', url.toString());
};
