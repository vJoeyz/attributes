import { ATTRIBUTES, getSelector, MATCHES, MODES, TAG_FORMATS } from '../utils/constants';
import { normalizePropKey } from '$cms/utils/props';
import { ensureUniqueFormFieldId } from '../utils/a11ty';
import { handleFilterInput } from './input';
import {
  extractCommaSeparatedValues,
  FORM_CSS_CLASSES,
  getObjectEntries,
  isFormField,
  isKeyOf,
  sameValues,
} from '@finsweet/ts-utils';

import type { FormBlockElement } from '@finsweet/ts-utils';
import type { FilterData, FilterElement, FiltersData, ResetButtonsData } from '../utils/types';

// Constants
const {
  field: { key: fieldKey },
  reset: { key: resetKey },
  range: { key: rangeKey },
  match: { key: matchKey },
  tagFormat: { key: tagFormatKey },
  tagCategory: { key: tagCategoryKey },
  hideEmpty: { key: hideEmptyKey, values: hideEmptyValues },
  highlight: { key: highlightKey, values: highlightValues },
  activeCSS: { key: activeCSSKey },
  debouncing: { key: debouncingKey },
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
    const filterKeys = rawFilterKeys
      ? [...new Set(extractCommaSeparatedValues(rawFilterKeys))].map((filterKey) => normalizePropKey(filterKey))
      : [];

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
 * - The highlight mode.
 *
 * @param form The form that contains the filter fields.
 * @param globalActiveCSSClass The global active CSS Class.
 * @param globalDebouncing The global debouncing value for `input` events.
 * @param highlightAll Defines if all matching values must be highlighted.
 *
 * @returns A {@link FiltersData} Map and a {@link FilterKeyResults} object.
 */
export const collectFiltersData = (
  form: HTMLFormElement,
  globalActiveCSSClass: string,
  globalDebouncing: number,
  highlightAll?: boolean
): FiltersData => {
  const filtersData: FiltersData = [];

  const elements = form.querySelectorAll<HTMLElement>(getSelector('field'));

  elements.forEach((element, index) => {
    // Collect the filter keys
    const rawFilterKeys = element.getAttribute(fieldKey);
    if (!rawFilterKeys) return;

    const filterKeys = [...new Set(extractCommaSeparatedValues(rawFilterKeys))].map((filterKey) =>
      normalizePropKey(filterKey)
    );

    if (!filterKeys.length) return;

    // Collect settings
    const settings = collectGlobalFilterSettings(
      element,
      filterKeys,
      globalActiveCSSClass,
      globalDebouncing,
      highlightAll
    );

    if (!settings) return;

    const [globalFilterData, globalElementData] = settings;

    // Collect existing data
    const existingData = filtersData.find((data) => sameValues(filterKeys, data.filterKeys));

    const filterData = existingData || {
      ...globalFilterData,
      elements: [],
    };

    if (!existingData) filtersData.push(filterData);

    // Handle Checkboxes or Radios
    const checkboxOrRadioField = element.closest<HTMLLabelElement>(`.${checkboxFieldCSSClass}, .${radioFieldCSSClass}`);

    if (checkboxOrRadioField) {
      const isCheckbox = element instanceof HTMLInputElement;

      const value = isCheckbox ? 'true' : element.textContent || '';

      const fieldElement = isCheckbox ? element : (checkboxOrRadioField.querySelector('input') as HTMLInputElement);

      ensureUniqueFormFieldId(fieldElement, index);

      const resultsElement = checkboxOrRadioField.querySelector<HTMLElement>(
        getSelector('element', 'filterResultsCount', { operator: 'prefixed' })
      );

      const mustHideEmpty = element.getAttribute(hideEmptyKey) === hideEmptyValues.true;
      const hideEmpty = mustHideEmpty ? checkboxOrRadioField : undefined;

      const elementData: FilterElement = {
        ...globalElementData,
        value,
        resultsElement,
        hideEmpty,
        element: fieldElement,
        type: fieldElement.type,
      } as const;

      filterData.elements.push(elementData);

      // Collect initial value
      handleFilterInput(fieldElement, filterData, elementData);

      return;
    }

    // Handle other Form Fields
    if (!isFormField(element) || element.type === 'submit') return;

    const { type, value } = element;

    ensureUniqueFormFieldId(element, index);

    const elementData: FilterElement = {
      ...globalElementData,
      element,
      type,
      value,
    };

    filterData.elements.push(elementData);

    // Collect initial value
    if (type === 'select-one') handleFilterInput(element, filterData, elementData);
  });

  return filtersData;
};

/**
 * Collects the global settings from a filter element.
 *
 * @param element The filter element.
 * @param filterKeys The filter keys.
 * @param globalActiveCSSClass The global active CSS Class.
 * @param globalDebouncing The global debouncing value for `input` events.
 * @param highlightAll Defines if all matching values must be highlighted.
 *
 * @returns A tuple with [globalFilterData, globalElementData].
 */
const collectGlobalFilterSettings = (
  element: HTMLElement,
  filterKeys: string[],
  globalActiveCSSClass: string,
  globalDebouncing: number,
  highlightAll?: boolean
) => {
  const rawMatch = element.getAttribute(matchKey);
  const rawHighlight = element.getAttribute(highlightKey);
  const rawTagFormat = element.getAttribute(tagFormatKey);
  const rawActiveCSSClass = element.getAttribute(activeCSSKey);
  const rawDebouncing = element.getAttribute(debouncingKey);

  const match = isKeyOf(rawMatch, MATCHES) ? rawMatch : undefined;
  const highlight = highlightAll || rawHighlight === highlightValues.true;
  const tagFormat = isKeyOf(rawTagFormat, TAG_FORMATS) ? rawTagFormat : undefined;
  const tagCategory = element.getAttribute(tagCategoryKey);
  const activeCSSClass = rawActiveCSSClass || globalActiveCSSClass;
  const debouncing = rawDebouncing ? parseFloat(rawDebouncing) : globalDebouncing;

  const rawMode = element.getAttribute(rangeKey);

  let filterMode: FilterData['mode'] | undefined;
  let elementMode: FilterElement['mode'] | undefined;

  for (const [key, value] of getObjectEntries(MODES)) {
    if (isKeyOf(rawMode, value)) {
      filterMode = key;
      elementMode = rawMode;
      break;
    }
  }

  // Collect global data
  const globalFilterData: Omit<FilterData, 'elements'> = {
    match,
    filterKeys,
    highlight,
    tagFormat,
    tagCategory,
    mode: filterMode,
    values: new Set(),
  };

  const globalElementData: Omit<FilterElement, 'element' | 'value' | 'type'> = {
    activeCSSClass,
    debouncing,
    resultsCount: 0,
    mode: elementMode,
    hidden: false,
  };

  return [globalFilterData, globalElementData] as const;
};
