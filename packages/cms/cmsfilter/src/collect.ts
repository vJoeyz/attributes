import { ATTRIBUTES, getSelector, MATCHES, MODES } from './constants';
import { extractCommaSeparatedValues, FORM_CSS_CLASSES, isFormField, isKeyOf } from '@finsweet/ts-utils';

import type { FormBlockElement } from '@finsweet/ts-utils';
import type { FiltersData, GrouppedFilterKeys, ResetButtonsData } from './CMSFilter';

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
    const filterKey = resetButton.getAttribute(resetKey);

    resetButtonsData.set(resetButton, filterKey);
  }

  return { form, submitButton, resetButtonsData };
};

/**
 * Collects the data of each filter input:
 * - The filter key.
 * - The filter mode.
 * - The fixed value, if existing.
 * @param form The form that contains the filter fields.
 * @returns A `FiltersData` map.
 */
export const collectFiltersData = (form: HTMLFormElement): [FiltersData, GrouppedFilterKeys] => {
  const filtersData: FiltersData = new Map();
  const grouppedFilterKeys: GrouppedFilterKeys = [];

  const elements = form.querySelectorAll<HTMLElement>(getSelector('field'));

  for (const element of elements) {
    const filterKey = element.getAttribute(fieldKey);
    if (!filterKey) continue;

    const filterKeys = extractCommaSeparatedValues(filterKey);

    if (filterKeys.length > 1) grouppedFilterKeys.push(filterKeys);

    const rawMatch = element.getAttribute(matchKey);
    const rawMode = element.getAttribute(rangeKey);

    const match = isKeyOf(rawMatch, MATCHES) ? rawMatch : undefined;
    const mode = isKeyOf(rawMode, MODES) ? rawMode : undefined;

    const checkboxOrRadioField = element.closest<HTMLLabelElement>(`.${checkboxFieldCSSClass}, .${radioFieldCSSClass}`);

    if (checkboxOrRadioField) {
      const isCheckbox = element instanceof HTMLInputElement;
      const fieldElement = isCheckbox ? element : (checkboxOrRadioField.querySelector('input') as HTMLInputElement);

      filtersData.set(fieldElement, {
        filterKeys,
        match,
        mode,
        fixedValue: isCheckbox ? undefined : element.textContent,
      });

      continue;
    }

    if (isFormField(element) && element.type !== 'submit') filtersData.set(element, { filterKeys, mode });
  }

  return [filtersData, grouppedFilterKeys];
};
