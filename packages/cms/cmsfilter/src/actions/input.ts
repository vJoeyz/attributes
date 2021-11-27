import type { FormField } from '@finsweet/ts-utils';
import type { FiltersData } from '../utils/types';

/**
 * Updates the `filtersData` object with the new input data.
 * Adds/Removes the active CSS Class.
 *
 * @param element The input element.
 * @param filtersData The {@link FiltersData} object.
 * @param activeCSSClass The CSS Class to be added to active elements.
 *
 * @returns `true` if the input event was valid and some filter data was updated.
 */
export const handleFilterInput = (element: FormField, filtersData: FiltersData, activeCSSClass: string): boolean => {
  const { value } = element;

  const relatedFilterData = filtersData.filter(({ elements }) => elements.some((data) => data.element === element));
  if (!relatedFilterData.length) return false;

  for (const relatedData of relatedFilterData) {
    const { elements, values: filterValues, mode: filterMode } = relatedData;

    const elementData = elements.find((data) => data.element === element);
    if (!elementData) continue;

    const { value: storedValue, mode: elementMode, type } = elementData;

    switch (type) {
      case 'checkbox': {
        const { checked } = <HTMLInputElement>element;

        if (!storedValue) break;

        element.parentElement?.classList[checked ? 'add' : 'remove'](activeCSSClass);

        filterValues[checked ? 'add' : 'delete'](storedValue);

        break;
      }
      case 'radio': {
        const { checked } = <HTMLInputElement>element;

        if (!checked || !storedValue) break;

        for (const { element: groupElement, type } of elements) {
          if (type !== 'radio') continue;

          groupElement.parentElement?.classList[groupElement === element ? 'add' : 'remove'](activeCSSClass);
        }

        filterValues.clear();
        filterValues.add(storedValue);

        break;
      }

      default: {
        elementData.value = value;

        if (filterMode === 'range') {
          const newValues = [...filterValues];
          newValues[elementMode === 'from' ? 0 : 1] = value;

          if (newValues.some((value) => !!value)) relatedData.values = new Set(newValues);
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
