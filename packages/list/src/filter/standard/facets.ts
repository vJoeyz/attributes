import { isFormField } from '@finsweet/attributes-utils';
import { toRaw, watch } from '@vue/reactivity';
import debounce from 'just-debounce';

import type { ListItem } from '../../components';
import type { List } from '../../components/List';
import { getAttribute, getSettingSelector, queryElement } from '../../utils/selectors';

import { filterItems } from '../filter';
import type { Filters } from '../types';
import { getConditionOperator } from './conditions';

/**
 * Initializes a specific filter's results count.
 * @param list
 * @param form
 */
export const initFacetCounts = (list: List, form: HTMLFormElement, groupIndex: number) => {
  const cleanups = [...form.elements].map((formField) => {
    if (!isFormField(formField)) return;

    const { type } = formField;
    if (type !== 'checkbox' && type !== 'radio') return;

    const fieldKey = getAttribute(formField, 'field');
    if (!fieldKey) return;

    const hideEmptySelector = getSettingSelector('hideempty', 'true');

    const hideEmptyTarget = formField.closest<HTMLElement>(hideEmptySelector);
    const resultsCountElement = queryElement('filter-results-count', { scope: formField.parentElement });

    if (!resultsCountElement && !hideEmptyTarget) return;

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

          if (hideEmptyTarget) {
            hideEmptyTarget.style.display = filteredItems.length ? '' : 'none';
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
