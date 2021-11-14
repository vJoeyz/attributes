import { getSelector } from './constants';

import type { TagData, TagsFormat } from './types';

/**
 * Updates the innter text of a filter tag.
 * @param tagData A {@link TagData} record.
 * @param format The output format.
 */
export const updateTagText = ({ element, filterKeys, values, mode }: TagData, format: TagsFormat): void => {
  const textNode = element.querySelector(getSelector('element', 'tagText', { operator: 'prefixed' })) || element;

  // Format the value
  const value = mode === 'range' ? `[${values.map((value) => value || '--').join(', ')}]` : values[0];

  // Capitalize the filter keys and join them
  const keys = filterKeys
    .map((filterKey) => filterKey.replace(/\w[^\s\-]*/g, (word) => word.replace(/^\w/, (char) => char.toUpperCase())))
    .join(', ');

  // Set the new text
  textNode.textContent = format === 'category' ? `${keys}: ${value}` : value;
};

/**
 * Checks if a tag has a specific `tag-remove` defined element.
 * @param tagElement
 */
// prettier-ignore
export const hasRemoveTrigger = (tagElement: HTMLElement): boolean => !!tagElement.querySelector(getSelector('element', 'tagRemove', { operator: 'prefixed' }));
