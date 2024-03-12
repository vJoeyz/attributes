import { isNumber } from '@finsweet/attributes-utils';

import type { ListItem } from '../components/ListItem';
import type { FiltersData } from './types';

export const filterItems = (filters: FiltersData, items: ListItem[]) => {
  const filteredItems = items.filter((item) => {
    // TODO: Support both `and` and `or` modes, this is just supporting `and` mode.
    const isValid = Object.values(filters).every((filterData) => {
      if (!filterData.value) return true;
      if (Array.isArray(filterData.value) && !filterData.value.length) return true;

      const fieldKeys = filterData.fieldKeys || Object.keys(item.fields);

      return fieldKeys.some((fieldKey) => {
        const fieldData = item.fields[fieldKey];
        if (!fieldData) return false;

        switch (filterData.op) {
          case 'exists': {
            return !!fieldData.value;
          }

          case 'nexists': {
            return !fieldData.value;
          }

          case 'eq':
          case 'neq': {
            // Multiple
            if (filterData.type === 'multiple') {
              const fieldValue = fieldData.value;

              return filterData.value.some((filterValue) => {
                return filterData.op === 'eq'
                  ? fieldValue.some((value) => value === filterValue)
                  : // @ts-expect-error weird type inference breaks TS here
                    fieldValue.every((value) => value !== filterValue);
              });
            }

            // Date
            if (filterData.type === 'date') {
              if (fieldData.type !== 'date') return false;

              const fieldValue = fieldData.value;
              const filterTime = filterData.value?.getTime();

              if (!filterTime) return false;

              return filterData.op === 'eq'
                ? fieldValue.some((value) => filterTime === value.getTime())
                : fieldValue.every((value) => filterTime !== value.getTime());
            }

            // Number
            if (filterData.type === 'number') {
              if (fieldData.type !== 'number') return false;

              const fieldValue = fieldData.value;

              return filterData.op === 'eq'
                ? fieldValue.some((value) => filterData.value === value)
                : fieldValue.every((value) => filterData.value !== value);
            }

            // Other
            const filterValue = String(filterData.value);
            const fieldValue = fieldData.value;

            const lowerCaseFilterValue = filterValue.toLowerCase();

            return filterData.op === 'eq'
              ? fieldValue.some((value) => String(value).toLowerCase() === lowerCaseFilterValue)
              : // @ts-expect-error weird type inference breaks TS here
                fieldValue.every((value) => String(value).toLowerCase() !== lowerCaseFilterValue);
          }

          case 'gt':
          case 'gte':
          case 'lt':
          case 'lte': {
            if (filterData.type !== 'number' && filterData.type !== 'date') return false;
            if (fieldData.type !== 'number' && fieldData.type !== 'date') return false;

            const fieldValue = fieldData.value;
            const filterValue = filterData.type === 'date' ? filterData.value?.getTime() : filterData.value;

            if (!isNumber(filterValue)) return false;

            return fieldValue.some((value) => {
              const numberValue = isNumber(value) ? value : value.getTime();

              switch (filterData.op) {
                case 'gt': {
                  return numberValue > filterValue;
                }
                case 'gte': {
                  return numberValue >= filterValue;
                }
                case 'lt': {
                  return numberValue < filterValue;
                }
                case 'lte': {
                  return numberValue <= filterValue;
                }
              }
            });
          }

          case 'includes':
          case 'nincludes': {
            if (filterData.type === 'multiple') {
              return filterData.op === 'includes'
                ? filterData.value.some((filterValue) => {
                    const fieldValue = fieldData.value;

                    return fieldValue.some((value) => value === filterValue);
                  })
                : filterData.value.every((filterValue) => {
                    const fieldValue = fieldData.value;

                    // @ts-expect-error weird type inference breaks TS here
                    return fieldValue.every((value) => value !== filterValue);
                  });
            }

            const fieldValue = fieldData.value;
            const lowerCaseFilterValue = String(filterData.value).toLowerCase();

            return filterData.op === 'includes'
              ? fieldValue.some((value) => String(value).toLowerCase().includes(lowerCaseFilterValue))
              : // @ts-expect-error weird type inference breaks TS here
                fieldValue.every((value) => !String(value).toLowerCase().includes(lowerCaseFilterValue));
          }
        }
      });
    });

    return isValid;
  });

  return filteredItems;
};
