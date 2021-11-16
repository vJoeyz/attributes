import { getSelector } from './constants';

import type { TagData, TagFormat } from './types';

/**
 * Updates the innter text of a filter tag.
 * @param tagData A {@link TagData} record.
 * @param format The output format.
 */
export const updateTagText = (
  { element, values, filterData: { filterKeys, mode, tagFormat, tagCategory } }: TagData,
  globalTagsFormat?: TagFormat
): void => {
  const textNode = element.querySelector(getSelector('element', 'tagText', { operator: 'prefixed' })) || element;

  // Format the value
  const value = mode === 'range' ? `[${values.map((value) => value || '--').join(', ')}]` : values[0];

  // Capitalize the filter keys and join them
  const keys = tagCategory || filterKeys.join(', ');

  // Set the new text
  textNode.textContent = (tagFormat || globalTagsFormat) === 'category' ? `${keys}: ${value}` : value;
};

/**
 * Checks if a tag has a specific `tag-remove` defined element.
 * @param tagElement
 */
// prettier-ignore
export const hasRemoveTrigger = (tagElement: HTMLElement): boolean => !!tagElement.querySelector(getSelector('element', 'tagRemove', { operator: 'prefixed' }));
