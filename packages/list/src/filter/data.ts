import { extractCommaSeparatedValues, type FormField, isFormField } from '@finsweet/attributes-utils';

import { getAttribute, getSettingSelector } from '../utils/selectors';
import type { FilterData, FilterOperator, FiltersData } from './types';

/**
 * @returns An object with the form fields as keys and their values as values.
 * @param form A {@link HTMLFormElement} element.
 */
export const getFiltersData = (form: HTMLFormElement) => {
  const data: FiltersData = {};

  for (const field of form.elements) {
    if (!isFormField(field)) continue;

    const { type } = field;
    if (type === 'submit') continue;

    const rawFieldKey = getAttribute(field, 'field');
    if (!rawFieldKey) continue;

    const filterData = getFilterData(field, rawFieldKey);
    const filterKey = `${rawFieldKey}_${filterData.op}`;

    data[filterKey] ||= getFilterData(field, rawFieldKey);
  }

  return data;
};

/**
 * @returns The value of a given form field.
 * @param formField A {@link FormField} element.
 */
export const getFilterData = (formField: FormField, rawFieldKey: string): FilterData => {
  const fieldKeys = rawFieldKey === '*' ? null : extractCommaSeparatedValues(rawFieldKey);

  const op: FilterOperator = getAttribute(formField, 'operator', true) || 'includes';

  const { type } = formField;

  switch (type) {
    // Checkbox
    case 'checkbox': {
      // Group
      const groupSelector = [
        `input[name="${formField.name}"][type="checkbox"][value]`,
        `input[name="${formField.name}"][type="checkbox"]${getSettingSelector('value')}`,
      ].join(',');

      const groupCheckboxes = formField.form?.querySelectorAll<HTMLInputElement>(groupSelector);

      if (groupCheckboxes?.length) {
        const values: string[] = [];

        for (const checkbox of groupCheckboxes) {
          const value = getAttribute(checkbox, 'value') || checkbox.value;
          if (!value || !checkbox.checked) continue;

          values.push(value);
        }

        return {
          type: 'multiple',
          value: values,
          fieldKeys,
          op,
        };
      }

      // Single
      const value = (formField as HTMLInputElement).checked ? 'true' : null;

      return {
        type: 'checkbox',
        value,
        fieldKeys,
        op,
      };
    }

    // Radio
    case 'radio': {
      const checkedRadio = formField.form?.querySelector<HTMLInputElement>(
        `input[name="${formField.name}"][type="radio"]:checked`
      );

      const value = checkedRadio ? getAttribute(checkedRadio, 'value') || checkedRadio.value : null;

      return {
        type,
        value,
        fieldKeys,
        op,
      };
    }

    // Numeric
    case 'number':
    case 'range': {
      const value = formField.value ? Number(formField.value) : null;

      return {
        type: 'number',
        value,
        fieldKeys,
        op,
      };
    }

    // Date
    case 'date': {
      const value = (formField as HTMLInputElement).valueAsDate || null;

      return {
        type,
        value,
        fieldKeys,
        op,
      };
    }

    // Select multiple
    case 'select-multiple': {
      const value = [...(formField as HTMLSelectElement).selectedOptions].map((option) => option.value);

      return {
        type: 'multiple',
        value,
        fieldKeys,
        op,
      };
    }

    // Default - Text
    default: {
      const { value } = formField;

      return {
        type: 'text',
        value,
        fieldKeys,
        op,
      };
    }
  }
};
