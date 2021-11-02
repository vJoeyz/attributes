import type { FormField } from '@finsweet/ts-utils';
import type { FiltersData } from './types';

/**
 * Updates the {@link FiltersValues} of the `CMSFilter` instance.
 * @param element The input element.
 * @param filtersValues The `FiltersValues` object.
 * @param filterData The {@link FilterData} of the input element.
 */
export const handleFilterInput = (element: FormField, filtersData: FiltersData): boolean => {
  const { value } = element;

  const relatedData = filtersData.filter(({ elements }) => elements.some((data) => data.element === element));
  if (!relatedData.length) return false;

  for (const data of relatedData) {
    const { elements, values: filterValues, mode: filterMode } = data;

    const elementData = elements.find((data) => data.element === element);
    if (!elementData) continue;

    const { value: storedValue, mode: elementMode, type } = elementData;

    switch (type) {
      case 'checkbox': {
        const { checked } = <HTMLInputElement>element;

        if (!storedValue) break;

        filterValues[checked ? 'add' : 'delete'](storedValue);
        break;
      }

      case 'radio': {
        const { checked } = <HTMLInputElement>element;

        if (!checked || !storedValue) break;

        filterValues.clear();
        filterValues.add(storedValue);

        break;
      }

      default: {
        elementData.value = value;

        if (filterMode === 'range') {
          const newValues = [...filterValues];
          newValues[elementMode === 'from' ? 0 : 1] = value;

          if (newValues.some((value) => !!value)) data.values = new Set(newValues);
          else filterValues.clear();

          break;
        } else {
          filterValues.clear();

          if (value) filterValues.add(value);
        }

        break;
      }
    }
  }

  return true;
};
