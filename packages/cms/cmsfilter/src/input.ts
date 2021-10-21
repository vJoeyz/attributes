import { isKeyOf } from '@finsweet/ts-utils';
import { RANGE_MODES } from './constants';

import type { FormField } from '@finsweet/ts-utils';
import type { FilterData, FilterProperties, FiltersValues } from './CMSFilter';

/**
 * Updates the {@link FiltersValues} of the `CMSFilter` instance.
 * @param target The input target.
 * @param filtersValues The `FiltersValues` object.
 * @param filterData The {@link FilterData} of the input target.
 */
export const handleFilterInput = (
  target: FormField,
  filtersValues: FiltersValues,
  { filterKeys, fixedValue, mode, match }: FilterData
) => {
  const { type, value } = target;

  const properties: FilterProperties = {
    mode,
    match,
    type,
  } as const;

  for (const filterKey of filterKeys) {
    const existingFilter = filtersValues.get(filterKey);

    if (existingFilter) Object.assign(existingFilter, properties);

    switch (type) {
      case 'checkbox': {
        const { checked } = <HTMLInputElement>target;

        if (existingFilter) {
          if (fixedValue) {
            existingFilter.values[checked ? 'add' : 'delete'](fixedValue);

            if (!existingFilter.values.size) filtersValues.delete(filterKey);
          } else if (checked) existingFilter.values = new Set([`${checked}`]);
          else filtersValues.delete(filterKey);

          break;
        }

        filtersValues.set(filterKey, {
          ...properties,
          values: new Set([checked && fixedValue ? fixedValue : `${checked}`]),
        });

        break;
      }

      case 'radio': {
        const { checked } = <HTMLInputElement>target;

        if (checked && fixedValue) {
          if (existingFilter) {
            existingFilter.values = new Set([fixedValue]);

            break;
          }

          filtersValues.set(filterKey, {
            ...properties,
            values: new Set([fixedValue]),
          });

          break;
        }

        filtersValues.delete(filterKey);

        break;
      }

      default: {
        const isRange = isKeyOf(mode, RANGE_MODES);

        if (!value && !isRange) {
          filtersValues.delete(filterKey);
          break;
        }

        if (existingFilter) {
          if (isRange) {
            const newValues = [...existingFilter.values];
            newValues[mode === 'from' ? 0 : 1] = value;

            existingFilter.values = new Set(newValues);
          } else existingFilter.values = new Set([value]);

          break;
        }

        filtersValues.set(filterKey, {
          ...properties,
          values: mode === 'to' ? new Set([, value]) : new Set([value]),
        });

        break;
      }
    }
  }
};
