import {
  addListener,
  FORM_CSS_CLASSES,
  type FormField,
  type FormFieldType,
  getFormFieldWrapper,
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
export const initStandardFilters = (list: List, forms: HTMLFormElement[]) => {
  const cleanups = forms.map((form, groupIndex) => initStandardFiltersForm(list, form, groupIndex));

  return () => {
    for (const cleanup of cleanups) {
      cleanup();
    }
  };
};

/**
 * Initializes standard filters for a list.
 * @param list
 * @param form
 * @param groupIndex
 * @returns A cleanup function.
 */
const initStandardFiltersForm = (list: List, form: HTMLFormElement, groupIndex: number) => {
  const debounces = new Map<string, number>();

  // Handle inputs
  const formElementCleanup = handleFiltersForm(form);
  const formFieldsCleanup = handleFormFields(list, form, groupIndex, debounces);

  // Handle clear buttons
  const clickCleanup = handleClearButtons(list, groupIndex, debounces);

  // Get initial filters
  const groupsMatch = getAttribute(form, 'groupsmatch', { filterInvalid: true });

  list.filters.value.groupsMatch ||= groupsMatch;
  list.filters.value.groups[groupIndex] = getSimpleFilters(list, form);

  // 2 way binding
  const twoWayBindingCleanup = watch(
    () => list.filters.value.groups[groupIndex]?.conditions,
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

    list.filters.value = { groups: [group], groupsMatch };
  });

  // mutationObserver.observe(form, {
  //   childList: true,
  //   subtree: true,
  // });

  const filterResultsCleanup = initFiltersResults(list, form, groupIndex);

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
 * @param fieldKey The field name.
 * @param interacted Indicates if the form field has been interacted with.
 */
const getConditionData = (formField: FormField, fieldKey: string, interacted = false): FiltersCondition => {
  const type = formField.type as FormFieldType;

  const op = getConditionOperator(formField);

  const filterMatch = getAttribute(formField, 'filtermatch', { filterInvalid: true });
  const fieldMatch = getAttribute(formField, 'fieldmatch', { filterInvalid: true });

  const baseData = {
    fieldKey,
    type,
    op,
    filterMatch,
    fieldMatch,
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
  for (const { fieldKey, value, op, type } of conditions) {
    const tagSelector = `:is(input[type="${type}"], select, textarea)`;
    const fieldSelector = getSettingSelector('field', fieldKey);
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

            simulateEvent(formField, ['click', 'input', 'change']);
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

            simulateEvent(checkbox, ['click', 'input', 'change']);
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

            simulateEvent(radio, ['click', 'input', 'change']);

            if (check) continue;

            // When unchecking a custom Webflow radio, we need to manually remove the focus and checked classes
            const customRadio = radio.parentElement?.querySelector(`.${FORM_CSS_CLASSES.radioInput}`);
            if (!customRadio) continue;

            customRadio.classList.remove(
              FORM_CSS_CLASSES.checkboxOrRadioFocus,
              FORM_CSS_CLASSES.checkboxOrRadioChecked
            );
          }
        }

        break;
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

    const fieldKey = getAttribute(formField, 'field');
    if (!fieldKey) continue;

    const data = getConditionData(formField, fieldKey, interacted);

    setActiveClass(formField);

    if (!group.conditions.some((c) => c.fieldKey === fieldKey && c.op === data.op)) {
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
const initFiltersResults = (list: List, form: HTMLFormElement, groupIndex: number) => {
  const cleanups = [...form.elements].map((formField) => {
    if (!isFormField(formField)) return;

    const { type } = formField;
    if (type !== 'checkbox' && type !== 'radio') return;

    const fieldKey = getAttribute(formField, 'field');
    if (!fieldKey) return;

    const hideEmpty = getAttribute(formField, 'hideempty') === 'true';
    const resultsCountElement = queryElement('filter-results-count', { scope: formField.parentElement });

    if (!resultsCountElement && !hideEmpty) return;

    const formFieldWrapper = getFormFieldWrapper(formField);

    const op = getConditionOperator(formField);
    const value = getAttribute(formField, 'value') || formField.value || '';

    const handler = debounce(
      ({ filters = list.filters.value, items = list.items.value }: { filters?: Filters; items?: ListItem[] }) => {
        const filtersClone = structuredClone(toRaw(filters)) as Filters;

        const conditionsGroup = filtersClone.groups[groupIndex];
        if (!conditionsGroup) return;

        const { conditions = [] } = conditionsGroup;
        const conditionIndex = conditions.findIndex((c) => c.fieldKey === fieldKey && c.op === op);

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
          if (resultsCountElement) {
            resultsCountElement.textContent = `${filteredItems.length}`;
          }

          if (hideEmpty) {
            formFieldWrapper.style.display = filteredItems.length ? '' : 'none';
          }
        });
      },
      0
    );

    const itemsCleanup = watch(list.items, (items) => handler({ items }));
    const filtersCleanup = watch(list.filters, (filters) => handler({ filters }), { deep: true, immediate: true });

    return () => {
      itemsCleanup();
      filtersCleanup();
    };
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
const handleFormFields = (list: List, form: HTMLFormElement, groupIndex: number, debounces: Map<string, number>) => {
  const event = getAttribute(form, 'filteron', { filterInvalid: true });

  // submit
  if (event === 'submit') {
    return addListener(form, 'submit', () => {
      list.readingFilters = true;

      list.filters.value.groups[groupIndex] = getSimpleFilters(list, form, true);

      list.readingFilters = false;
    });
  }

  // input / change
  return addListener(form, event, (e) => {
    const { target } = e;

    if (!isFormField(target)) return;

    const fieldKey = getAttribute(target, 'field');
    if (!fieldKey) return;

    const condition = getConditionData(target, fieldKey, true);

    setActiveClass(target);

    const update = () => {
      const conditions = list.filters.value.groups[groupIndex]?.conditions || [];

      const conditionIndex = conditions.findIndex((c) => c.fieldKey === fieldKey && c.op === condition.op);

      list.readingFilters = true;

      if (conditionIndex >= 0) {
        conditions[conditionIndex] = condition;
      } else {
        conditions.push(condition);
      }

      list.readingFilters = false;
    };

    const debounceKey = `${fieldKey}_${condition.op}`;
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
const handleClearButtons = (list: List, groupIndex: number, debounces: Map<string, number>) => {
  return addListener(window, 'click', (e) => {
    const { target } = e;

    if (!(target instanceof Element)) return;

    const { instance, filters } = list;

    const clearElementSelector = getElementSelector('clear', { instance });
    const clearElement = target?.closest(clearElementSelector);
    if (!clearElement) return;

    const fieldKey = getAttribute(clearElement, 'field');

    const conditions = filters.value.groups[groupIndex]?.conditions || [];
    const conditionsToClear = fieldKey ? conditions.filter((condition) => condition.fieldKey === fieldKey) : conditions;

    for (const condition of conditionsToClear) {
      debounces.delete(`${condition.fieldKey}_${condition.op}`);

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
 */
const setActiveClass = (formField: FormField) => {
  const activeClass = getAttribute(formField, 'activeclass');

  switch (formField.type) {
    case 'checkbox': {
      const { checked } = formField as HTMLInputElement;
      const target = getFormFieldWrapper(formField);

      target.classList.toggle(activeClass, checked);
      break;
    }

    case 'radio': {
      const groupRadios = getRadioGroupInputs(formField);

      for (const radio of groupRadios) {
        const target = getFormFieldWrapper(radio);

        target.classList.toggle(activeClass, radio.checked);
      }

      break;
    }

    default: {
      formField.classList.toggle(activeClass, !!formField.value);
    }
  }
};
