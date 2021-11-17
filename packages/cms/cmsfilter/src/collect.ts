import { ATTRIBUTES, getSelector, MATCHES, MODES, TAG_FORMATS } from './constants';
import { checkCMSCoreVersion } from '$cms/utils/versioning';
import { normalizePropKey } from '$cms/utils/props';
import {
  extractCommaSeparatedValues,
  FORM_CSS_CLASSES,
  getObjectEntries,
  isFormField,
  isKeyOf,
  sameValues,
} from '@finsweet/ts-utils';

import type { FormBlockElement } from '@finsweet/ts-utils';
import type { FilterData, FilterElement, FiltersData, ResetButtonsData } from './types';

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
    let filterKeys = rawFilterKeys ? [...new Set(extractCommaSeparatedValues(rawFilterKeys))] : [];

    // `cmscore v1.2.0` implements propKeys normalization.
    // TODO: Make this a default after 24th November.
    if (checkCMSCoreVersion('>=', '1.2.0')) filterKeys = filterKeys.map((filterKey) => normalizePropKey(filterKey));

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
 * @param form The form that contains the filter fields.
 *
 * @returns A {@link FiltersData} Map and a {@link FilterKeyResults} object.
 */
export const collectFiltersData = (form: HTMLFormElement, highlightAll?: boolean): FiltersData => {
  const filtersData: FiltersData = [];
  // const filterKeyResults: FilterKeyResults = {};

  const elements = form.querySelectorAll<HTMLElement>(getSelector('field'));

  for (const element of elements) {
    // Collect settings
    const rawFilterKeys = element.getAttribute(fieldKey);
    if (!rawFilterKeys) continue;

    let filterKeys = [...new Set(extractCommaSeparatedValues(rawFilterKeys))];
    if (!filterKeys.length) continue;

    // `cmscore v1.2.0` implements propKeys normalization.
    // TODO: Make this a default after 24th November.
    if (checkCMSCoreVersion('>=', '1.2.0')) filterKeys = filterKeys.map((filterKey) => normalizePropKey(filterKey));

    const existingData = filtersData.find((data) => sameValues(filterKeys, data.filterKeys));

    const rawMatch = element.getAttribute(matchKey);
    const rawHighlight = element.getAttribute(highlightKey);
    const rawTagFormat = element.getAttribute(tagFormatKey);

    const match = isKeyOf(rawMatch, MATCHES) ? rawMatch : undefined;
    const highlight = highlightAll || rawHighlight === highlightValues.true;
    const tagFormat = isKeyOf(rawTagFormat, TAG_FORMATS) ? rawTagFormat : undefined;
    const tagCategory = element.getAttribute(tagCategoryKey);

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
      resultsCount: 0,
      mode: elementMode,
      hidden: false,
    };

    // Checkbox or Radios
    const checkboxOrRadioField = element.closest<HTMLLabelElement>(`.${checkboxFieldCSSClass}, .${radioFieldCSSClass}`);

    if (checkboxOrRadioField) {
      const isCheckbox = element instanceof HTMLInputElement;

      const value = isCheckbox ? 'true' : element.textContent || '';

      const fieldElement = isCheckbox ? element : (checkboxOrRadioField.querySelector('input') as HTMLInputElement);
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

      if (existingData) existingData.elements.push(elementData);
      else {
        filtersData.push({
          ...globalFilterData,
          elements: [elementData],
        });
      }

      continue;
    }

    // Other Form Fields
    if (!isFormField(element) || element.type === 'submit') continue;

    const { type, value } = element;

    const elementData: FilterElement = {
      ...globalElementData,
      element,
      type,
      value,
    };

    if (existingData) existingData.elements.push(elementData);
    else {
      filtersData.push({
        ...globalFilterData,
        elements: [elementData],
      });
    }
  }

  return filtersData;
};
