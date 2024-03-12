import {
  addListener,
  cloneNode,
  createRenderController,
  type FormField,
  simulateEvent,
} from '@finsweet/attributes-utils';
import { atom, type WritableAtom } from 'nanostores';

import type { List } from '../components/List';
import type { ListItem } from '../components/ListItem';
import { queryElement } from '../utils/selectors';

export const initAdvancedFilters = (list: List, form: HTMLFormElement) => {
  const conditionGroup = queryElement('condition-group', { scope: form });
  if (!conditionGroup) return;

  const conditionGroupsWrapper = conditionGroup.parentElement;
  if (!conditionGroupsWrapper) return;

  const conditionGroupTemplate = cloneNode(conditionGroup);

  const conditionGroups = atom<HTMLElement[]>([]);

  const cleanups = new Set<() => void>();

  // Construct destroy
  const destroy = () => {
    for (const cleanup of cleanups) {
      cleanup();
      cleanups.clear();
    }

    conditionGroup.remove();

    conditionGroups.set(conditionGroups.get().filter(($conditionGroup) => $conditionGroup !== conditionGroup));
  };

  // Handle condition groups matching
  const conditionGroupMatch = queryElement<HTMLSelectElement>('condition-group-match', { scope: form });
  if (conditionGroupMatch) {
    const renderController = createRenderController(conditionGroupMatch);

    const renderCleanup = conditionGroups.subscribe(($conditionGroups) => {
      const shouldRender = $conditionGroups.length > 1;

      renderController.update(shouldRender);
    });

    cleanups.add(renderCleanup);
    cleanups.add(renderController.destroy);
  }

  // Handle adding condition groups
  const conditionGroupAdd = queryElement('condition-group-add', { scope: form });
  if (conditionGroupAdd) {
    const clickCleanup = addListener(conditionGroupAdd, 'click', () => {
      const conditionGroupClone = cloneNode(conditionGroupTemplate);

      const groupCleanup = initConditionGroup(list, conditionGroupClone, conditionGroups);
      if (!groupCleanup) return;

      cleanups.add(groupCleanup);

      const $conditionGroups = conditionGroups.get();
      const previousConditionGroup = $conditionGroups[$conditionGroups.length - 2];

      if (previousConditionGroup) {
        previousConditionGroup.after(conditionGroupClone);
      } else {
        conditionGroupsWrapper.append(conditionGroupClone);
      }
    });

    cleanups.add(clickCleanup);
  }

  // Init default condition group
  const groupCleanup = initConditionGroup(list, conditionGroup, conditionGroups);
  if (groupCleanup) {
    cleanups.add(groupCleanup);
  }

  return destroy;
};

const initConditionGroup = (list: List, conditionGroup: HTMLElement, conditionGroups: WritableAtom<HTMLElement[]>) => {
  const condition = queryElement('condition', { scope: conditionGroup });
  if (!condition) return;

  const conditionTemplate = cloneNode(condition);

  const groupConditions = atom<HTMLElement[]>([]);

  const cleanups = new Set<() => void>();

  // Construct destroy
  const destroy = () => {
    for (const cleanup of cleanups) {
      cleanup();
      cleanups.clear();
    }

    conditionGroup.remove();

    conditionGroups.set(conditionGroups.get().filter(($conditionGroup) => $conditionGroup !== conditionGroup));
  };

  // Handle condition matching
  const conditionMatch = queryElement<HTMLSelectElement>('condition-match', { scope: conditionGroup });
  if (conditionMatch) {
    const renderController = createRenderController(conditionMatch);

    const renderCleanup = groupConditions.subscribe(($groupConditions) => {
      const shouldRender = $groupConditions.length > 1;

      renderController.update(shouldRender);
    });

    cleanups.add(renderCleanup);
    cleanups.add(renderController.destroy);
  }

  // Handle adding conditions to the group
  const conditionAdd = queryElement('condition-add', { scope: conditionGroup });
  if (conditionAdd) {
    const clickCleanup = addListener(conditionAdd, 'click', () => {
      const conditionClone = cloneNode(conditionTemplate);

      const conditionCleanup = initCondition(list, conditionClone, groupConditions);
      if (!conditionCleanup) return;

      cleanups.add(conditionCleanup);

      const $groupConditions = groupConditions.get();
      const previousCondition = $groupConditions[$groupConditions.length - 2];

      if (previousCondition) {
        previousCondition.after(conditionClone);
      } else {
        conditionGroup.append(conditionClone);
      }
    });

    cleanups.add(clickCleanup);
  }

  // Handle removing the group
  const conditionGroupRemove = queryElement('condition-group-remove', { scope: conditionGroup });
  if (conditionGroupRemove) {
    // Handle remove button click
    const clickCleanup = addListener(conditionGroupRemove, 'click', () => {
      if (conditionGroups.get().length <= 1) return;

      destroy();
    });

    // Handle remove button display
    const renderController = createRenderController(conditionGroupRemove);

    const renderCleanup = conditionGroups.subscribe(($conditionGroups) => {
      const shouldRender = $conditionGroups.length > 1;

      renderController.update(shouldRender);
    });

    cleanups.add(clickCleanup);
    cleanups.add(renderCleanup);
    cleanups.add(renderController.destroy);
  }

  // Init default condition
  const conditionCleanup = initCondition(list, condition, groupConditions);
  if (conditionCleanup) {
    cleanups.add(conditionCleanup);
  }

  // Store the condition group
  conditionGroups.set([...conditionGroups.get(), conditionGroup]);

  return destroy;
};

/**
 * Inits a condition
 * @param list
 * @param condition
 * @param groupConditions
 * @returns A cleanup function
 */
const initCondition = (list: List, condition: HTMLElement, groupConditions: WritableAtom<HTMLElement[]>) => {
  const conditionField = queryElement<HTMLSelectElement>('condition-field', { scope: condition });
  if (!(conditionField instanceof HTMLSelectElement)) return;

  const conditionOperator = queryElement<FormField>('condition-operator', { scope: condition });
  if (!conditionOperator) return;

  const conditionValue = queryElement<FormField>('condition-value', { scope: condition });
  if (!conditionValue) return;

  const cleanups = new Set<() => void>();

  // Construct destroy
  const destroy = () => {
    for (const cleanup of cleanups) {
      cleanup();
      cleanups.clear();
    }

    condition.remove();

    groupConditions.set(groupConditions.get().filter(($conditionWrapper) => $conditionWrapper !== condition));
  };

  // Populate condition field options
  const itemsCleanup = list.items.subscribe((items) => {
    populateConditionField(items, conditionField);
  });

  cleanups.add(itemsCleanup);

  // Handle remove button
  const conditionRemove = queryElement('condition-remove', { scope: condition });
  if (conditionRemove) {
    // Handle remove button display
    const displayCleanup = groupConditions.subscribe(($groupConditions) => {
      conditionRemove.style.display = $groupConditions.length > 1 ? '' : 'none';
    });

    // Handle removing the condition
    const clickCleanup = addListener(conditionRemove, 'click', () => {
      if (groupConditions.get().length <= 1) return;

      destroy();
    });

    cleanups.add(displayCleanup);
    cleanups.add(clickCleanup);
  }

  // Store the condition
  groupConditions.set([...groupConditions.get(), condition]);

  return destroy;
};

/**
 * Populates a condition field dropdown with the fields from the list items
 * @param items
 * @param conditionField
 */
const populateConditionField = (items: readonly ListItem[], conditionField: HTMLSelectElement) => {
  // Collect fields
  const fields = items.reduce((acc, curr) => {
    for (const key in curr.fields) {
      acc.add(key);
    }

    return acc;
  }, new Set<string>());

  // Clear options
  for (const option of conditionField.options) {
    if (option.value) {
      option.remove();
    }
  }

  // Populate options
  for (const field of fields) {
    const option = document.createElement('option');

    option.value = field;
    option.textContent = field;

    conditionField.appendChild(option);
  }

  // Simulate input event
  simulateEvent(conditionField, 'input');
};
