import {
  addListener,
  FORM_CSS_CLASSES,
  type FormField,
  type FormFieldType,
  getRadioGroupInputs,
  isFormField,
  isHTMLInputElement,
  isHTMLSelectElement,
  isNumber,
  simulateEvent,
} from '@finsweet/attributes-utils';
import { toRaw, watch } from '@vue/reactivity';
import debounce from 'just-debounce';

import type { ListItem } from '../components';
import type { List } from '../components/List';
import { getCheckboxGroup } from '../utils/dom';
import { getAttribute, getElementSelector, getSettingSelector, queryElement } from '../utils/selectors';
import { handleFiltersForm } from './elements';
import { filterItems } from './filter';
import type { Filters, FiltersCondition, FiltersGroup } from './types';

/**
 * Initializes standard filters for a list.
 * @param list
 * @param form
 * @returns A cleanup function.
 */
export const initStandardFilters = (list: List, form: HTMLFormElement) => {
  const debounces = new Map<string, number>();

  // Handle inputs
  const formElementCleanup = handleFiltersForm(form);
  const formFieldsCleanup = handleFormFields(list, form, debounces);

  // Handle clear buttons
  const clickCleanup = handleClearButtons(list, debounces);

  // Get initial filters
  const groupsMatch = getAttribute(form, 'groupsmatch', { filterInvalid: true });
  const group = getSimpleFilters(list, form);
  const filters: Filters = { groups: [group], groupsMatch };

  Object.assign(list.filters, filters);

  // 2 way binding
  const twoWayBindingCleanup = watch(
    () => list.filters.groups[0]?.conditions,
    (conditions) => {
      if (list.readingFilters) return;

      setConditionsData(form, conditions);
    },
    { deep: true }
  );

  // Get filters on node changes
  // TODO: bail when added/removed nodes are not form fields
  const mutationObserver = new MutationObserver(() => {
    const group = getSimpleFilters(list, form);
    const filters: Filters = { groups: [group], groupsMatch };

    Object.assign(list.filters, filters);
  });

  // mutationObserver.observe(form, {
  //   childList: true,
  //   subtree: true,
  // });

  const filterResultsCleanup = initFiltersResults(list, form);

  return () => {
    formElementCleanup();
    formFieldsCleanup();
    clickCleanup();
    twoWayBindingCleanup();
    filterResultsCleanup();
    mutationObserver.disconnect();
  };
};

/**
 * @returns The value of a given form field.
 * @param formField A {@link FormField} element.
 * @param field The field name.
 * @param interacted Indicates if the form field has been interacted with.
 */
const getConditionData = (formField: FormField, field: string, interacted = false): FiltersCondition => {
  const type = formField.type as FormFieldType;

  const op = getConditionOperator(formField);

  const filterMatch = getAttribute(formField, 'filtermatch', { filterInvalid: true });
  const fieldMatch = getAttribute(formField, 'fieldmatch', { filterInvalid: true });
  const activeClass = getAttribute(formField, 'activeclass');

  const baseData = {
    field,
    type,
    op,
    filterMatch,
    fieldMatch,
    activeClass,
    interacted,
  } satisfies Partial<FiltersCondition>;

  switch (type) {
    // Checkbox
    case 'checkbox': {
      // Group
      const groupCheckboxes = getCheckboxGroup(formField.name, formField.form);
      if (groupCheckboxes?.length) {
        const values: string[] = [];

        for (const checkbox of groupCheckboxes) {
          const value = getAttribute(checkbox, 'value') ?? checkbox.value;
          if (!value || !checkbox.checked) continue;

          values.push(value);
        }

        return {
          ...baseData,
          value: values,
        };
      }

      // Single
      const { checked } = formField as HTMLInputElement;
      const value = checked ? 'true' : '';

      return {
        ...baseData,
        value,
      };
    }

    // Radio
    case 'radio': {
      const checkedRadio = formField.form?.querySelector<HTMLInputElement>(
        `input[name="${formField.name}"][type="radio"]:checked`
      );

      const value = checkedRadio ? getAttribute(checkedRadio, 'value') ?? checkedRadio.value : '';

      return {
        ...baseData,
        value,
      };
    }

    // Select multiple
    case 'select-multiple': {
      const value = [...(formField as HTMLSelectElement).selectedOptions].map((option) => option.value);

      return {
        ...baseData,
        value,
      };
    }

    // Dates
    case 'date':
    case 'month':
    case 'week':
    case 'time': {
      const { valueAsDate, value: _value } = formField as HTMLInputElement;
      const value = valueAsDate ? valueAsDate.toISOString() : _value;

      return {
        ...baseData,
        value,
      };
    }

    // Default - Text
    default: {
      const { value } = formField;

      const fuzzy = getAttribute(formField, 'fuzzy');

      return {
        ...baseData,
        value,
        fuzzy,
      };
    }
  }
};

/**
 * Sets the form fields' values based on the provided conditions.
 * @param form
 * @param conditions
 */
export const setConditionsData = (form: HTMLFormElement, conditions: FiltersCondition[]) => {
  for (const { field, value, op, type } of conditions) {
    const tagSelector = `:is(input, select, textarea)[type="${type}"]`;
    const fieldSelector = getSettingSelector('field', field);
    const operatorSelector = `:is(${getSettingSelector('operator', op)}, :not(${getSettingSelector('operator')}))`;
    const selector = [tagSelector, fieldSelector, operatorSelector].join('');

    const formField = form.querySelector(selector);
    if (!isFormField(formField)) continue;

    switch (type) {
      // Checkboxes
      case 'checkbox': {
        if (!isHTMLInputElement(formField)) break;

        // Single checkbox
        if (!Array.isArray(value)) {
          const check = value === 'true';

          if (check !== formField.checked) {
            formField.checked = check;

            simulateEvent(formField, ['input', 'change']);
          }

          break;
        }

        const groupCheckboxes = getCheckboxGroup(formField.name, form);
        if (!groupCheckboxes?.length) break;

        for (const checkbox of groupCheckboxes) {
          const checkboxValue = getAttribute(checkbox, 'value') ?? checkbox.value;
          const check = value.includes(checkboxValue);

          if (check !== checkbox.checked) {
            checkbox.checked = check;

            simulateEvent(checkbox, ['input', 'change']);
          }
        }

        break;
      }

      // Radios
      case 'radio': {
        if (Array.isArray(value)) break;

        const groupRadios = getRadioGroupInputs(formField, form);

        for (const radio of groupRadios) {
          const radioValue = getAttribute(radio, 'value') ?? radio.value;
          const check = radioValue === value;

          if (check !== radio.checked) {
            radio.checked = check;

            simulateEvent(radio, ['input', 'change']);
          }
        }
      }

      // Select-multiple
      case 'select-multiple': {
        if (!Array.isArray(value) || !isHTMLSelectElement(formField)) break;

        for (const option of formField.options) {
          const select = value.includes(option.value);

          if (select !== option.selected) {
            option.selected = select;

            simulateEvent(option, ['input', 'change']);
          }
        }

        break;
      }

      // Other
      default: {
        if (Array.isArray(value)) break;

        if (formField.value !== value) {
          formField.value = value;

          simulateEvent(formField, ['input', 'change']);
        }
      }
    }
  }
};

/**
 * Retrieves the condition operator based on the form field type.
 *
 * @param formField The form field to retrieve the operator for.
 * @returns The condition operator as a string, with the proper fallback value.
 */
const getConditionOperator = (formField: FormField) => {
  const type = formField.type as FormFieldType;

  const stringInputTypes: FormFieldType[] = ['text', 'password', 'email', 'tel', 'url', 'search', 'color'];
  const opDefault = stringInputTypes.includes(type) ? 'contain' : 'equal';

  const op = getAttribute(formField, 'operator', { filterInvalid: true }) || opDefault;
  return op;
};

/**
 * @returns An object with the form fields as keys and their values as values.
 * @param list A {@link List} instance.
 * @param form A {@link HTMLFormElement} element.
 * @param interacted Indicates if the form has been interacted with.
 */
const getSimpleFilters = (list: List, form: HTMLFormElement, interacted = false) => {
  list.readingFilters = true;

  const group: FiltersGroup = {
    conditions: [],
    conditionsMatch: getAttribute(form, 'conditionsmatch', { filterInvalid: true }),
  };

  for (const formField of form.elements) {
    if (!isFormField(formField)) continue;

    const { type } = formField;
    if (type === 'submit') continue;

    const field = getAttribute(formField, 'field');
    if (!field) continue;

    const data = getConditionData(formField, field);

    setActiveClass(formField, data.activeClass);

    if (!group.conditions.some((c) => c.field === field && c.op === data.op)) {
      group.conditions.push(data);
    }
  }

  list.readingFilters = false;

  return group;
};

/**
 * Initializes a specific filter's results count.
 * @param list
 * @param form
 */
const initFiltersResults = (list: List, form: HTMLFormElement) => {
  const cleanups = [...form.elements].map((formField) => {
    if (!isFormField(formField)) return;

    const { type } = formField;
    if (type !== 'checkbox' && type !== 'radio') return;

    const field = getAttribute(formField, 'field');
    if (!field) return;

    const resultsCountElement = queryElement('filter-results-count', { scope: formField.parentElement });
    if (!resultsCountElement) return;

    const op = getConditionOperator(formField);
    const value = getAttribute(formField, 'value') || formField.value || '';

    const handler = debounce(([filters, items]: [Filters, ListItem[]]) => {
      const filtersClone = structuredClone(toRaw(filters)) as Filters;

      const conditionsGroup = filtersClone.groups[0];
      if (!conditionsGroup) return;

      const { conditions = [] } = conditionsGroup;
      const conditionIndex = conditions.findIndex((c) => c.field === field && c.op === op);

      const condition = conditions[conditionIndex];
      if (!condition) return;

      // Inject the condition value
      if (Array.isArray(condition.value)) {
        if (condition.filterMatch === 'and') {
          condition.value.push(value);
        } else {
          condition.value = [value];
        }
      } else {
        condition.value = value;
      }

      filterItems(filtersClone, items).then((filteredItems) => {
        resultsCountElement.textContent = `${filteredItems.length}`;
      });
    }, 0);

    const cleanup = watch([list.filters, list.items], handler, { deep: true, immediate: true });
    return cleanup;
  });

  return () => {
    for (const cleanup of cleanups) {
      cleanup?.();
    }
  };
};

/**
 * Handles the form inputs.
 * @param list
 * @param form
 * @param debounces
 * @returns A cleanup function.
 */
const handleFormFields = (list: List, form: HTMLFormElement, debounces: Map<string, number>) => {
  const event = getAttribute(form, 'filteron', { filterInvalid: true });

  // submit
  if (event === 'submit') {
    return addListener(form, 'submit', (e) => {
      list.readingFilters = true;

      list.filters.groups[0] = getSimpleFilters(list, form, true);

      list.readingFilters = false;
    });
  }

  // input / change
  return addListener(form, event, (e) => {
    const { target } = e;

    if (!isFormField(target)) return;

    const field = getAttribute(target, 'field');
    if (!field) return;

    const condition = getConditionData(target, field, true);

    setActiveClass(target, condition.activeClass);

    const update = () => {
      const conditions = list.filters.groups[0]?.conditions || [];

      const conditionIndex = conditions.findIndex((c) => c.field === field && c.op === condition.op);

      list.readingFilters = true;

      if (conditionIndex >= 0) {
        conditions[conditionIndex] = condition;
      } else {
        conditions.push(condition);
      }

      list.readingFilters = false;
    };

    const debounceKey = `${field}_${condition.op}`;
    const debounce = debounces.get(debounceKey);

    if (debounce) {
      clearTimeout(debounce);
    }

    // With debouncing
    const timeout = getAttribute(target, 'debounce');

    if (isNumber(timeout) && !isNaN(timeout)) {
      const timeoutId = window.setTimeout(update, timeout);

      debounces.set(debounceKey, timeoutId);
      return;
    }

    // Without debouncing
    update();
  });
};

/**
 * Handles the clear buttons.
 * @param list
 * @param debounces
 * @returns A cleanup function.
 */
const handleClearButtons = (list: List, debounces: Map<string, number>) => {
  return addListener(window, 'click', (e) => {
    const { target } = e;

    if (!(target instanceof Element)) return;

    const { instance, filters } = list;

    const clearElementSelector = getElementSelector('clear', { instance });
    const clearElement = target?.closest(clearElementSelector);
    if (!clearElement) return;

    const field = getAttribute(clearElement, 'field');

    const conditions = filters.groups[0]?.conditions || [];
    const conditionsToClear = field ? conditions.filter((condition) => condition.field === field) : conditions;

    for (const condition of conditionsToClear) {
      debounces.delete(`${condition.field}_${condition.op}`);

      if (Array.isArray(condition.value)) {
        condition.value = [];
      } else {
        condition.value = '';
      }
    }
  });
};

/**
 * Sets the active class to a form field.
 * @param formField
 * @param activeClass
 */
const setActiveClass = (formField: FormField, activeClass: string) => {
  switch (formField.type) {
    case 'checkbox': {
      const { checked } = formField as HTMLInputElement;
      const checkboxParent = formField.closest(`.${FORM_CSS_CLASSES.checkboxField}`);
      const target = checkboxParent || formField;

      target.classList.toggle(activeClass, checked);
      break;
    }

    case 'radio': {
      const groupRadios = getRadioGroupInputs(formField);

      for (const radio of groupRadios) {
        const radioParent = radio.closest(`.${FORM_CSS_CLASSES.radioField}`);
        const target = radioParent || radio;

        target.classList.toggle(activeClass, radio.checked);
      }

      break;
    }

    default: {
      formField.classList.toggle(activeClass, !!formField.value);
    }
  }
};
