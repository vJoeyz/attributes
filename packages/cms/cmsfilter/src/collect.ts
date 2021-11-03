import { ATTRIBUTES, getSelector, MATCHES, MODES } from './constants';
import {
  extractCommaSeparatedValues,
  FORM_CSS_CLASSES,
  getObjectEntries,
  isFormField,
  isKeyOf,
  sameValues,
} from '@finsweet/ts-utils';

import type { FormBlockElement } from '@finsweet/ts-utils';
import type { ElementMode, FilterData, FilterElement, FilterMode, FiltersData, ResetButtonsData } from './types';

// Constants
const {
  field: { key: fieldKey },
  reset: { key: resetKey },
  range: { key: rangeKey },
  match: { key: matchKey },
} = ATTRIBUTES;

const { checkboxField: checkboxFieldCSSClass, radioField: radioFieldCSSClass } = FORM_CSS_CLASSES;

/**
 * Collects the base elements of the Filters system: the form, submit button and reset buttons.
 * @param formBlock The Filters Form Block.
 */
export const collectFiltersElements = (
  formBlock: FormBlockElement
): {
  form: HTMLFormElement;
  submitButton: HTMLInputElement | null;
  resetButtonsData: ResetButtonsData;
} => {
  const form = formBlock.querySelector('form') as HTMLFormElement;
  const submitButton = formBlock.querySelector<HTMLInputElement>('input[type="submit"]');

  const resetButtonElements = formBlock.querySelectorAll<HTMLElement>(
    getSelector('element', 'reset', { operator: 'prefixed' })
  );
  const resetButtonsData: ResetButtonsData = new Map();

  for (const resetButton of resetButtonElements) {
    const rawFilterKeys = resetButton.getAttribute(resetKey);
    const filterKeys = rawFilterKeys ? [...new Set(extractCommaSeparatedValues(rawFilterKeys))] : [];

    resetButtonsData.set(resetButton, filterKeys);
  }

  return { form, submitButton, resetButtonsData };
};

/**
 * Collects the data of each filter input:
 * - The filter elements.
 * - The filter keys.
 * - The filter mode.
 * - The fixed value, if existing.
 * @param form The form that contains the filter fields.
 * @returns A `FiltersData` map.
 */
export const collectFiltersData = (form: HTMLFormElement): FiltersData => {
  const filtersData: FiltersData = [];

  const elements = form.querySelectorAll<HTMLElement>(getSelector('field'));

  for (const element of elements) {
    const rawFilterKeys = element.getAttribute(fieldKey);
    if (!rawFilterKeys) continue;

    const filterKeys = [...new Set(extractCommaSeparatedValues(rawFilterKeys))];
    if (!filterKeys.length) continue;

    const existingData = filtersData.find((data) => sameValues(filterKeys, data.filterKeys));

    const rawMatch = element.getAttribute(matchKey);
    const rawMode = element.getAttribute(rangeKey);

    const match = isKeyOf(rawMatch, MATCHES) ? rawMatch : undefined;

    let filterMode: FilterMode | undefined;
    let elementMode: ElementMode | undefined;

    for (const [key, value] of getObjectEntries(MODES)) {
      if (isKeyOf(rawMode, value)) {
        filterMode = key;
        elementMode = rawMode;
        break;
      }
    }

    const filterData: Omit<FilterData, 'elements'> = {
      match,
      filterKeys,
      mode: filterMode,
      values: new Set(),
    };

    const checkboxOrRadioField = element.closest<HTMLLabelElement>(`.${checkboxFieldCSSClass}, .${radioFieldCSSClass}`);

    if (checkboxOrRadioField) {
      const isCheckbox = element instanceof HTMLInputElement;
      const fieldElement = isCheckbox ? element : (checkboxOrRadioField.querySelector('input') as HTMLInputElement);

      const elementData: FilterElement = {
        mode: elementMode,
        element: fieldElement,
        type: fieldElement.type,
        value: isCheckbox ? 'true' : element.textContent || '',
      } as const;

      if (existingData) existingData.elements.push(elementData);
      else {
        filtersData.push({
          ...filterData,
          elements: [elementData],
        });
      }

      continue;
    }

    if (isFormField(element) && element.type !== 'submit') {
      const { type, value } = element;

      const elementData: FilterElement = { element, type, value, mode: elementMode };

      if (existingData) existingData.elements.push(elementData);
      else {
        filtersData.push({
          ...filterData,
          elements: [elementData],
        });
      }
    }
  }

  return filtersData;
};
