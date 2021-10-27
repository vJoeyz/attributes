import type { FormField } from '@finsweet/ts-utils';
import type { FiltersData } from './types';

/**
 * Updates the {@link FiltersValues} of the `CMSFilter` instance.
 * @param element The input element.
 * @param filtersValues The `FiltersValues` object.
 * @param filterData The {@link FilterData} of the input element.
 */
export const handleFilterInput = (element: FormField, filtersData: FiltersData) => {
  const { value } = element;

  const relatedData = filtersData.filter(({ elements }) => elements.some((data) => data.element === element));

  if (!relatedData.length) return;

  for (const data of relatedData) {
    const { elements, values: filterValues, mode: filterMode } = data;

    const elementData = elements.find((data) => data.element === element);
    if (!elementData) continue;

    const { fixedValue, mode: elementMode, type } = elementData;

    switch (type) {
      case 'checkbox': {
        const { checked } = <HTMLInputElement>element;

        if (!fixedValue) break;

        filterValues[checked ? 'add' : 'delete'](fixedValue);
        break;
      }

      case 'radio': {
        const { checked } = <HTMLInputElement>element;

        if (!checked || !fixedValue) break;

        filterValues.clear();
        filterValues.add(fixedValue);

        break;
      }

      default: {
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
};
