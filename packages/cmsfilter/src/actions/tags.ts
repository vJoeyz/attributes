import { queryElement } from '../utils/selectors';
import type { TagData, TagFormat } from '../utils/types';

/**
 * Updates the innter text of a filter tag.
 * @param tagData A {@link TagData} record.
 * @param format The output format.
 */
export const updateTagText = (
  { values, textNode, filterData: { originalFilterKeys, mode, tagFormat, tagCategory } }: TagData,
  globalTagsFormat?: TagFormat
): void => {
  // Capitalize the filter keys and join them
  const keys = tagCategory || originalFilterKeys.join(', ');

  // Format the value
  let value: string;

  if (mode === 'range') value = `[${values.map((value) => value || '--').join(', ')}]`;
  else [value] = values;

  // Set the new text
  let textContent: string;

  if (value === 'true') textContent = keys;
  else if ((tagFormat || globalTagsFormat) === 'category') textContent = `${keys}: ${value}`;
  else textContent = value;

  textNode.textContent = textContent;
};

/**
 * Checks if a tag has a specific `tag-remove` defined element.
 * @param tagElement
 */
export const hasRemoveTrigger = (tagElement: HTMLElement): boolean =>
  !!queryElement('tag-remove', { scope: tagElement });
