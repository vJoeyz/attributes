import { addListener, cloneNode, isDate, isNotEmpty, isNumber } from '@finsweet/attributes-utils';
import { watch } from '@vue/reactivity';

import type { List } from '../components/List';
import { SETTINGS } from '../utils/constants';
import { getAttribute, queryElement } from '../utils/selectors';
import type { FilterOperator, Filters } from './types';
import { parseFilterValue } from './utils';

const OPERATOR_SYMBOLS: Record<FilterOperator, string> = {
  empty: '∅',
  'not-empty': '!∅',
  contain: '∈',
  'not-contain': '∉',
  equal: '=',
  'not-equal': '≠',
  less: '<',
  'less-equal': '≤',
  greater: '>',
  'greater-equal': '≥',
  fuzzy: '≈',
};

/**
 * Inits the tags for the list.
 * @param list
 * @returns
 */
export const initTags = (list: List) => {
  const tagTemplate = queryElement('tag', { instance: list.instance });
  if (!tagTemplate) return;

  const tagsList = tagTemplate.parentElement;
  if (!tagsList) return;

  const tagsListsWrapper = tagsList.parentElement;

  tagTemplate.remove();

  const tagsListTemplate = cloneNode(tagsList);

  const renderedTagLists: Array<{
    element: HTMLElement;
    tags: Map<string, { element: HTMLElement; cleanup: () => void }>;
  }> = [{ element: tagsList, tags: new Map() }];

  const watcherCleanup = watch(
    list.filters,
    (filters: Filters) => {
      filters.groups.forEach((group, groupIndex) => {
        // Get the tag list, if existing
        let tagList = renderedTagLists[groupIndex];

        const tagListIsRendered = !!tagList;

        if (!tagList) {
          tagList = { element: cloneNode(tagsListTemplate), tags: new Map() };
          renderedTagLists[groupIndex] = tagList;
        }

        // Render the tags
        group.conditions.forEach((condition, conditionIndex) => {
          // Get the tag, if existing
          const tagKey = `${condition.fieldKey}_${condition.op}`;

          let tag = tagList.tags.get(tagKey);

          const tagIsRendered = !!tag;

          // Remove the tag if the value is empty
          const shouldRender =
            condition.interacted && condition.value && (Array.isArray(condition.value) ? condition.value.length : true);

          if (!shouldRender) {
            tag?.cleanup();
            return;
          }

          if (!tag) {
            const element = cloneNode(tagTemplate);
            const removeElement = queryElement('tag-remove', { scope: element });
            const removeCleanup = addListener(removeElement, 'click', () => {
              group.conditions[conditionIndex].value = Array.isArray(condition.value) ? [] : '';
            });

            tag = {
              element,
              cleanup: () => {
                removeCleanup();
                tag?.element.remove();
                tagList.tags.delete(tagKey);
              },
            };

            tagList.tags.set(tagKey, tag);
          }

          const fieldElement = queryElement('tag-field', { scope: tag.element });
          const operatorElement = queryElement('tag-operator', { scope: tag.element });
          const valueElement = queryElement('tag-value', { scope: tag.element });

          const operatorOverwriteElements = new Map(
            SETTINGS.operator.values
              .map((operator) => {
                const operatorOverwriteElement = queryElement(`tag-operator-${operator}`, { scope: tag.element });
                if (!operatorOverwriteElement) return;

                return [operator, operatorOverwriteElement] as const;
              })
              .filter(isNotEmpty)
          );

          // Field
          if (fieldElement) {
            fieldElement.textContent = condition.fieldKey;
          }

          // Operator
          const operator = condition.op;
          const operatorOverwriteElement = operatorOverwriteElements.get(operator);

          if (operatorElement || operatorOverwriteElement) {
            // Overwrite exists
            if (operatorOverwriteElement) {
              operatorElement?.remove();
              operatorOverwriteElements.delete(operator);
            }

            // Fallback
            else if (operatorElement) {
              const operatorSymbol = OPERATOR_SYMBOLS[operator];
              operatorElement.textContent = operatorSymbol;
            }

            // Remove all unused overwrites
            for (const [, element] of operatorOverwriteElements) {
              element.remove();
            }
          }

          // Value
          if (valueElement) {
            // No value
            if (!condition.value) {
              valueElement.remove();
            }

            // Has value
            else {
              // Format the value, if needed
              let formattedValue = condition.value;

              const formatDisplay = getAttribute(valueElement, 'formatdisplay');
              if (formatDisplay) {
                const locale = formatDisplay === 'true' ? undefined : formatDisplay;

                if (Array.isArray(condition.value)) {
                  formattedValue = condition.value.map((value) => {
                    const parsedValue = parseFilterValue(value, condition.type);

                    if (isNumber(parsedValue)) {
                      return parsedValue.toLocaleString(locale);
                    }

                    if (isDate(parsedValue)) {
                      return parsedValue.toLocaleDateString(locale);
                    }

                    return value;
                  });
                } else {
                  const parsedValue = parseFilterValue(condition.value, condition.type);

                  if (isNumber(parsedValue)) {
                    formattedValue = parsedValue.toLocaleString(locale);
                  }

                  if (isDate(parsedValue)) {
                    formattedValue = parsedValue.toLocaleDateString(locale);
                  }
                }
              }

              // Set the value
              const value = Array.isArray(formattedValue)
                ? formattedValue.join(condition.filterMatch === 'or' ? ' | ' : ' & ')
                : formattedValue;

              valueElement.textContent = value;
            }
          }

          if (!tagIsRendered) {
            tagList.element.appendChild(tag.element);
          }
        });

        if (!tagListIsRendered) {
          tagsListsWrapper?.appendChild(tagList.element);
        }
      });
    },
    { deep: true }
  );

  return () => {
    watcherCleanup();

    for (const { tags } of renderedTagLists) {
      for (const [, tag] of tags) {
        tag.cleanup();
      }
    }
  };
};
